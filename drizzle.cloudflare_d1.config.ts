import { configDotenv } from 'dotenv'
import  {  defineConfig } from 'drizzle-kit'

configDotenv()

const { D1_CLOUDFLARE_ACCOUNT_ID, D1_CLOUDFLARE_DATABASE_ID, D1_CLOUDFLARE_API_TOKEN } = process.env

if (!D1_CLOUDFLARE_ACCOUNT_ID) throw new Error('Missing D1_CLOUDFLARE_ACCOUNT_ID')
if (!D1_CLOUDFLARE_DATABASE_ID) throw new Error('Missing D1_CLOUDFLARE_DATABASE_ID')
if (!D1_CLOUDFLARE_API_TOKEN) throw new Error('Missing D1_CLOUDFLARE_API_TOKEN')

export default defineConfig({
    out: './drizzle/cloudflare_d1',
    schema: './database/cloudflare_d1/schema.ts',
    dialect: 'sqlite',
    driver: 'd1-http',
    migrations: {
        prefix: 'unix'
    },
    strict: true,
    dbCredentials: {
        databaseId: D1_CLOUDFLARE_DATABASE_ID,
        accountId: D1_CLOUDFLARE_ACCOUNT_ID,
        token: D1_CLOUDFLARE_API_TOKEN
    }
})
