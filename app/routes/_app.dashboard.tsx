import { redirect } from 'react-router'
import { createAuth } from '~/services/auth.server'
import type { Route } from './+types/_app'

export async function loader({ context, request }: Route.LoaderArgs) {
  const auth = createAuth(context.db)
  const sessionData = await auth.api.getSession({
    headers: request.headers
  })

  if (sessionData) {
    return null
  }
  throw redirect('/account/login')
}

export default function page() {
  return (
    <>
      <title>Dashboard - Breeze Stack</title>
      <div className="container mx-auto p-2 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </div>
    </>
  )
}
