import { drizzle } from 'drizzle-orm/d1'
import type { DrizzleD1Database } from 'drizzle-orm/d1'
import * as schema from '~/database/cloudflare_d1/schema'
import { createAuth } from '~/services/auth.server'

const db: DrizzleD1Database<typeof schema> = drizzle(process.env.DB as unknown as D1Database, { schema })

export const auth = createAuth(
  {
    AI: process.env.AI as unknown as Ai<AiModels>,
    APP__ENV: process.env.APP__ENV as 'local' | 'development' | 'staging' | 'production',
    APP__NAME: process.env.APP__NAME as
      | 'Breeze Stack - Local'
      | 'Breeze Stack - Development'
      | 'Breeze Stack - Staging'
      | 'Breeze Stack',
    BETTER_AUTH__SECRET: process.env.BETTER_AUTH__SECRET as string,
    DB: process.env.DB as unknown as D1Database,
    KV: process.env.KV as unknown as KVNamespace
  },
  db
)
