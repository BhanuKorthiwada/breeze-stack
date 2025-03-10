import { redirect } from 'react-router'
import { createAuth } from '~/services/auth.server'
import type { Route } from './+types/_app'

export async function loader({ context, request }: Route.LoaderArgs) {
  const auth = createAuth(context.cloudflare.env, context.db)
  const sessionData = await auth.api.getSession({
    headers: request.headers
  })
  if (sessionData) {
    await auth.api.signOut({
      headers: request.headers
    })
    return redirect('/account/login')
  }

  throw redirect('/account/login')
}
