import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import dotenv from 'dotenv'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { migrations } from '@/database/migrations'

import collections from '@/collections'
import { i18n, localization } from '@/lang'

import Users from '@/collections/Users/users.schema'
import config from '@config'

dotenv.config()

const filename = fileURLToPath(import.meta.url)
const rootDir = path.resolve(path.dirname(filename), '..')

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections,
  i18n,
  localization,
  editor: lexicalEditor({}),
  secret: config.payload.secret ?? '',
  typescript: {
    outputFile: path.resolve(rootDir, 'src', 'types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(rootDir, 'src', 'schema.graphql'),
  },
  db: postgresAdapter({
    idType: 'uuid',
    migrationDir: path.resolve(rootDir, 'src', 'database', 'migrations'),
    prodMigrations: migrations, // Run migrations on init
    pool: {
      connectionString: config.database.uri,
    },
  }),
  telemetry: false,
})
