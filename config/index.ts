import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const configSchema = z.object({
  env: z.enum(['development', 'production', 'test']).default(process.env.NODE_ENV ?? 'development'),
  baseURL: z
    .string()
    .url()
    .default(process.env.BASE_URL ?? 'http://localhost:3001'),
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
})

// Infer the type from the schema
export type Config = z.infer<typeof configSchema>

// Parse and validate the configuration
const config: Config = configSchema.parse({})

export default config
