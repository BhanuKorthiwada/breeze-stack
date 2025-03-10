import { type SubmissionResult, getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { APIError } from 'better-auth/api'
import { AlertCircle } from 'lucide-react'
import { Link, type MetaFunction, data, redirect } from 'react-router'
import { Form, useActionData, useNavigation } from 'react-router'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { createAuth } from '~/services/auth.server'
import type { Route } from './+types/account.register'

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Register - Breeze Stack'
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

const schema = z
  .object({
    intent: z.literal('form'),
    name: z.string().min(2).max(100),
    email: z.string().email().min(3).max(255),
    password: z.string().trim().min(8).max(100),
    confirmPassword: z.string().trim().min(8).max(100),
    remember: z.boolean().optional(),
    'cf-turnstile-response': z.string().optional()
  })
  .refine((data) => {
    return data.password === data.confirmPassword
  })

export const action = async ({ request, context }: Route.ActionArgs) => {
  try {
    const formData = await request.formData()
    const submission = parseWithZod(formData, { schema })

    if (submission.status !== 'success') {
      return {
        success: false,
        submissionResult: submission.reply({
          hideFields: ['password', 'confirmPassword']
        })
      }
    }

    const auth = createAuth(context.cloudflare.env, context.db)

    if (submission.value.intent === 'form') {
      const { name, email, password } = submission.value

      try {
        const authResponse = await auth.api.signUpEmail({
          body: {
            name,
            email,
            password
          },
          asResponse: true,
          returnHeaders: true
        })
        return authResponse
      } catch (error) {
        if (error instanceof APIError) {
          console.error('account > register > action:form:error', error.message, error.status)
        }

        const submissionResult: SubmissionResult<string[]> = {
          status: 'error',
          error: { '': ['Error occurred while registering, please try again.'] }
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
  } catch (error) {
    if (error instanceof APIError) {
      console.error('account > register > action:error', error.message, error.status)
    }

    const submissionResult: SubmissionResult<string[]> = {
      status: 'error',
      error: { '': [error instanceof Error ? error.message : 'Error occurred while registering, please try again.'] }
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
      return parseWithZod(formData, { schema })
    }
  })

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Create an account</CardTitle>
        <CardDescription>Signup with your Google account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form method="POST" {...getFormProps(form)}>
          {actionData?.success === false && actionData.submissionResult.status === 'error' && (
            <div className="rounded bg-red-50 p-4 text-red-700">{actionData.submissionResult.error?.[0]}</div>
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
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  required
                  aria-invalid={fields.name.errors ? true : undefined}
                  aria-errormessage={fields.name.errors ? 'name-error' : undefined}
                />
                {fields.name.errors && (
                  <div id="name-error" className="text-sm text-red-500">
                    {fields.name.errors}
                  </div>
                )}
              </div>
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
                <Label htmlFor="password">Password</Label>
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
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  aria-invalid={fields.confirmPassword.errors ? true : undefined}
                  aria-errormessage={fields.confirmPassword.errors ? 'confirmPassword-error' : undefined}
                />
                {fields.confirmPassword.errors && (
                  <div id="confirmPassword-error" className="text-sm text-red-500">
                    {fields.confirmPassword.errors}
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting} name="intent" value="form">
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
            </div>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link to="/account/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  )
}
