import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const configSchema = z.object({
  env: z.enum(['development', 'production', 'test']).default(process.env.NODE_ENV ?? 'development'),
  baseURL: z
    .string()
    .url()
    .default(process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3001'),
  database: z
    .object({
      uri: z
        .string()
        .url()
        .default((process.env.NODE_ENV === 'test' ? process.env.DATABASE_TEST_URI : process.env.DATABASE_URI) ?? ''),
    })
    .default({}),
  payload: z
    .object({
      secret: z
        .string()
        .min(1)
        .default(process.env.PAYLOAD_SECRET ?? ''),
    })
    .default({}),
  roles: z
    .object({
      system: z
        .object({
          admin: z.object({ name: z.string().default('Admin'), description: z.string().default('Admin') }).default({}),
          user: z.object({ name: z.string().default('User'), description: z.string().default('User') }).default({}),
        })
        .default({}),
    })
    .default({}),
  tenants: z
    .object({
      default: z
        .object({
          name: z.string().default('Default'),
          description: z.string().default('Default tenant'),
        })
        .default({}),
    })
    .default({}),
  integrations: z.object({}).default({}),
})

// Infer the type from the schema
export type Config = z.infer<typeof configSchema>

// Parse and validate the configuration
const config: Config = configSchema.parse({})

export default config
