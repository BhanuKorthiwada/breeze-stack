import { createAuthClient } from 'better-auth/client'
import { apiKeyClient, organizationClient } from 'better-auth/client/plugins'
import { twoFactorClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      teams: {
        enabled: true
      }
    }),
    twoFactorClient(),
    apiKeyClient()
  ]
})
