import { drizzle } from 'drizzle-orm/d1'
import type { DrizzleD1Database } from 'drizzle-orm/d1'
import * as schema from '~/database/cloudflare_d1/schema'
import { createAuth } from '~/services/auth.server'

const db: DrizzleD1Database<typeof schema> = drizzle(process.env.DB as unknown as D1Database, { schema })

export const auth = createAuth(db)
