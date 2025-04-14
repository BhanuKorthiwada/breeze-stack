import { Outlet, redirect } from 'react-router'
import { createAuth } from '~/services/auth.server'
import type { Route } from './+types/_app'
import { AppFooter } from '~/components/app-footer'
import { AppHeader } from '~/components/app-header'

export async function loader({ context, request }: Route.LoaderArgs) {
  const auth = createAuth(context.db)
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

export default function layout() {
  return (
    <>
      <AppHeader />
      <div className="container mx-auto min-h-[70vh]">
        <Outlet />
      </div>
      <AppFooter />
    </>
  )
}
