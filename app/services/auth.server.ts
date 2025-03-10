import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { apiKey, organization, twoFactor } from 'better-auth/plugins'
import type { DrizzleD1Database } from 'drizzle-orm/d1'
import type * as schema from '~/database/cloudflare_d1/schema'

export const createAuth = (env: CloudflareWorkerEnvironment, db: DrizzleD1Database<typeof schema>) =>
  betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      usePlural: true
    }),
    session: {
      preserveSessionInDatabase: true,
      storeSessionInDatabase: true
    },
    plugins: [
      organization({
        teams: {
          enabled: true
        }
      }),
      twoFactor(),
      apiKey()
    ],
    secret: env.BETTER_AUTH__SECRET,
    emailAndPassword: {
      enabled: true
    },
    rateLimit: {
      window: 60,
      max: 10
    },
    advanced: {
      cookiePrefix: 'bs',
      useSecureCookies: env.APP__ENV === 'production',
      generateId: () => {
        return crypto.randomUUID()
      }
    }
  })

export type Auth = ReturnType<typeof createAuth>
