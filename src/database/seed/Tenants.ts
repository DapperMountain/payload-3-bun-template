import type { Tenant } from '@/types'
import { Payload } from 'payload'

/**
 * Seeds tenants into the database if they don't already exist.
 *
 * This function defines an array of tenant objects to seed into the database.
 * It first checks if any tenants with the same names already exist in the database.
 * If any such tenants exist, it logs a message and skips the creation.
 *
 * @param {Payload} payload - The Payload instance to interact with the database.
 * @returns {Promise<void>} A promise that resolves when the seeding process is complete.
 */
export default async function seed(payload: Payload): Promise<void> {
  const tenants: Partial<Tenant>[] = [
    { name: 'Tenant A', description: 'First tenant' },
    { name: 'Tenant B', description: 'Second tenant' },
    // Add more tenants as needed
  ]

  for (const tenant of tenants) {
    try {
      // Check if the tenant already exists
      const exists = (
        await payload.find({
          collection: 'tenants',
          pagination: false,
          where: {
            name: {
              equals: tenant.name,
            },
          },
          locale: 'all',
          overrideAccess: true,
        })
      )?.totalDocs

      if (exists) {
        payload.logger.warn(`🚨  [Tenants] Tenant "${tenant.name}" already exists, skipping.`)
        continue
      }

      // Create the tenant if it doesn't exist
      await payload.create({
        collection: 'tenants',
        data: tenant as Tenant,
        overrideAccess: true,
      })

      payload.logger.info(`✅  [Tenants] Tenant "${tenant.name}" inserted successfully.`)
    } catch (error) {
      payload.logger.error(
        `❌  [Tenants] Failed to insert tenant "${tenant.name}": ${
          error instanceof Error ? error.message : 'Unknown error occurred.'
        }`,
      )
    }
  }
}
