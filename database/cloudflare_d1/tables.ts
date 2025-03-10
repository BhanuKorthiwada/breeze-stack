import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const feedback = sqliteTable(
  'feedback',
  {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    email: text().notNull().unique(),
    message: text().notNull()
  },
  (table) => [index('feedback__email_idx').on(table.email)]
)
