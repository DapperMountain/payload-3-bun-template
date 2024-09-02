import type { Role } from '@/types'
import { Payload } from 'payload'

/**
 * Seeds roles into the database if they don't already exist.
 *
 * @param {Payload} payload - The Payload instance to interact with the database.
 * @returns {Promise<void>} A promise that resolves when the seeding process is complete.
 */
export default async function seed(payload: Payload): Promise<void> {
  const roles: Partial<Role>[] = [
    {
      name: 'Admin',
      description: 'Admin',
      type: 'system',
    },
    {
      name: 'User',
      description: 'User',
      type: 'system',
    },
  ]

  for (const role of roles) {
    try {
      const exists = (
        await payload.find({
          collection: 'roles',
          pagination: false,
          where: {
            name: {
              equals: role.name,
            },
          },
          locale: 'all',
          overrideAccess: true,
        })
      )?.totalDocs

      if (exists) {
        payload.logger.warn(`🚨  [Roles] Role "${role.name}" already exists, skipping.`)
        continue
      }

      await payload.create({
        collection: 'roles',
        data: role as Role,
        overrideAccess: true,
      })

      payload.logger.info(`✅  [Roles] Role "${role.name}" inserted successfully.`)
    } catch (error) {
      payload.logger.error(
        `❌  [Roles] Failed to insert role "${role.name}": ${
          error instanceof Error ? error.message : 'Unknown error occurred.'
        }`,
      )
    }
  }
}
