import { Link, redirect, useLoaderData } from 'react-router'
import { Button } from '~/components/ui/button'
import { createAuth } from '~/services/auth.server'
import type { Route } from './+types/_app.user.profile'

export async function loader({ context, request }: Route.LoaderArgs) {
  const auth = createAuth(context.cloudflare.env, context.db)
  const sessionData = await auth.api.getSession({
    headers: request.headers
  })

  if (sessionData) {
    return {
      name: sessionData.user.name,
      email: sessionData.user.email
    }
  }
  throw redirect('/account/login')
}

export default function page() {
  const { name, email } = useLoaderData<typeof loader>()

  return (
    <>
      <title>Profile - Breeze Stack</title>
      <div className="container mx-auto p-2 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p>{name}</p>
          <p>{email}</p>
          <Button asChild>
            <Link to="/user/logout">Logout</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
