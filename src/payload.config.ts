import path from 'path'
import dotenv from 'dotenv'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { migrations } from '@/database/migrations'

import Users from '@/collections/Users/users.schema'
import Roles from '@/collections/Roles/roles.schema'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export function isTestEnv() {
  return process.env.NODE_ENV === 'test'
}

dotenv.config()

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Roles],
  localization: {
    locales: [
      {
        label: 'English',
        code: 'en',
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload.types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'schema.graphql'),
  },
  db: postgresAdapter({
    idType: 'uuid',
    migrationDir: path.resolve(dirname, 'src', 'database', 'migrations'),
    prodMigrations: migrations, // Run migrations on init
    pool: {
      connectionString: process.env[!isTestEnv() ? 'DATABASE_URI' : 'DATABASE_TEST_URI'],
    },
  }),
  telemetry: false,
})
