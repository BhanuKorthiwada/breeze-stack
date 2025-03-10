import { type SubmissionResult, getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { AlertCircle } from 'lucide-react'
import { Link, type MetaFunction, data, redirect } from 'react-router'
import { Form, useActionData, useNavigation } from 'react-router'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { createAuth } from '~/services/auth.server'
import type { Route } from './+types/account.login'

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Login - Breeze Stack'
    }
  ]
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const auth = createAuth(context.cloudflare.env, context.db)
  const sessionData = await auth.api.getSession({
    headers: request.headers
  })

  if (sessionData) {
    throw redirect('/dashboard')
  }
  return null
}

const googleSchema = z.object({
  intent: z.literal('google').optional().default('google'),
  remember: z.boolean().optional(),
  'cf-turnstile-response': z.string().optional()
})

const formSchema = z.object({
  intent: z.literal('form'),
  email: z
    .string()
    .email({
      message: 'Invalid email address'
    })
    .toLowerCase()
    .min(3)
    .max(255),
  password: z.string().trim().min(8).max(100),
  remember: z.boolean().optional(),
  'cf-turnstile-response': z.string().optional()
})

const schema = z.discriminatedUnion('intent', [formSchema, googleSchema])

export const action = async ({ request, context }: Route.ActionArgs) => {
  try {
    const formData = await request.formData()

    const submission = parseWithZod(formData, {
      schema: schema
    })

    if (submission.status !== 'success') {
      return {
        success: false,
        submissionResult: submission.reply({
          hideFields: ['password']
        })
      }
    }

    const auth = createAuth(context.cloudflare.env, context.db)

    if (submission.value.intent === 'google') {
      const authResponse = await auth.api.signInSocial({
        body: {
          provider: 'google',
          callbackURL: '/dashboard'
        }
      })

      if (!authResponse.url) {
        const submissionResult: SubmissionResult<string[]> = {
          status: 'error',
          error: { '': ['Failed to sign in with Google'] }
        }
        return {
          success: false,
          submissionResult: submissionResult
        }
      }

      throw redirect(authResponse.url, 302)
    }

    if (submission.value.intent === 'form') {
      const { email, password } = submission.value

      try {
        const authResponse = await auth.api.signInEmail({
          body: {
            email,
            password,
            callbackURL: '/dashboard'
          },
          headers: request.headers,
          asResponse: true,
          returnHeaders: true
        })

        return authResponse
      } catch (error) {
        return data(
          {
            success: false,
            submissionResult: submission.reply({
              hideFields: ['password'],
              formErrors: ['Error occurred while signing in, please try again.']
            })
          },
          { status: 500 }
        )
      }
    }
  } catch (error) {
    const submissionResult: SubmissionResult<string[]> = {
      status: 'error',
      error: { '': ['Failed to sign in'] }
    }

    return data(
      {
        success: false,
        submissionResult: submissionResult
      },
      { status: 500 }
    )
  }
}

export default function page() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'
  const [form, fields] = useForm({
    lastResult: navigation.state === 'idle' ? actionData?.submissionResult : null,
    shouldRevalidate: 'onBlur',
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: schema
      })
    }
  })

  return (
    <>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="POST" {...getFormProps(form)}>
            {actionData?.success === false && actionData.submissionResult?.status === 'error' && (
              <div className="rounded bg-red-50 p-4 text-red-700">{actionData.submissionResult?.error?.[0]}</div>
            )}

            {actionData?.success === false && actionData.submissionResult?.error?.['']?.[0] ? (
              <div className="bg-destructive/10 p-3 rounded-md flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="text-sm text-destructive">{actionData.submissionResult.error[''][0]}</div>
              </div>
            ) : null}
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="user@example.com"
                    required
                    aria-invalid={fields.email.errors ? true : undefined}
                    aria-errormessage={fields.email.errors ? 'email-error' : undefined}
                  />
                  {fields.email.errors && (
                    <div id="email-error" className="text-sm text-red-500">
                      {fields.email.errors}
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/account/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    aria-invalid={fields.password.errors ? true : undefined}
                    aria-errormessage={fields.password.errors ? 'password-error' : undefined}
                  />
                  {fields.password.errors && (
                    <div id="password-error" className="text-sm text-red-500">
                      {fields.password.errors}
                    </div>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting} name="intent" value="form">
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link to="/account/register" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}
