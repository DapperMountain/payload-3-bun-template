import { Payload } from 'payload'
import type { Role } from '@/payload.types'

/**
 * Seeds roles into the database if they don't already exist.
 *
 * This function defines an array of role objects to seed into the database.
 * It first checks if any roles with the same names already exist in the database.
 * If any such roles exist, it logs a message and skips the creation.
 *
 * @param {Payload} payload - The Payload instance to interact with the database.
 * @returns {Promise<void>} A promise that resolves when the seeding process is complete.
 */
export default async function seed(payload: Payload): Promise<void> {
  const roles: Partial<Role>[] = [
    {
      name: 'Admin',
      description: 'Admin',
    },
    {
      name: 'User',
      description: 'User',
    },
  ]

  for (const role of roles) {
    try {
      // Check if the role already exists
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

      // Create the role if it doesn't exist
      await payload.create({
        collection: 'roles',
        data: role as Role,
        locale: null,
        overrideAccess: true,
      })

      payload.logger.info(`✅  [Roles] Role "${role.name}" inserted successfully.`)
    } catch (error) {
      if (error instanceof Error) {
        payload.logger.error(`❌  [Roles] Failed to insert role "${role.name}": ${error.message}`)
      } else {
        payload.logger.error(`❌  [Roles] Failed to insert role "${role.name}": Unknown error occurred`)
      }
    }
  }
}
