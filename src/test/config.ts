import config from '@config'
import payloadConfig from '@payload-config'
import { sql } from '@payloadcms/db-postgres'
import { afterAll, beforeAll } from 'bun:test'
import { Payload, getPayload } from 'payload'

let payload: Payload

export function isTestEnv() {
  return config.env === 'test'
}

export function throwIfNotTestEnv() {
  if (!isTestEnv()) throw Error('process.env.NODE_ENV needs to be set to `test`')
}

beforeAll(async () => {
  // Throw an error if we're not in the test environment so we don't reset the wrong database
  throwIfNotTestEnv()

  try {
    payload = await getPayload({ config: payloadConfig })
  } catch (error) {
    console.error('Error during setup:', error)
    throw error // Re-throw to fail the test if necessary
  }
})

afterAll(async () => {
  // Throw an error if we're not in the test environment so we don't reset the wrong database
  throwIfNotTestEnv()

  // Fetch all table names from the current schema except the migration table
  const result = await payload.db.drizzle.execute(sql`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public';
      `)

  const tables: string[] = result.rows.map((row: { tablename: string }) => row.tablename as string)

  // Truncate each table except the migration table
  for (const table of tables) {
    await payload.db.drizzle.execute(sql`TRUNCATE TABLE ${sql.raw(table)} RESTART IDENTITY CASCADE;`)
  }
})

export { payload }
