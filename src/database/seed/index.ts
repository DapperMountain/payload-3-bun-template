import payloadConfig from '@payload-config'
import { getPayload } from 'payload'
import addRoles from './Roles'
import addUsers from './Users'

/**
 * Seeds the database, in order
 */
async function seed(): Promise<void> {
  const payload = await getPayload({ config: payloadConfig })

  const seeders = [
    { name: 'Roles', seedFunction: addRoles },
    { name: 'Users', seedFunction: addUsers },
  ]

  for (const { name, seedFunction } of seeders) {
    try {
      payload.logger.info(`🌱  [${name}] Attempting to seed data.`)
      await seedFunction(payload)
      payload.logger.info(`✅  [${name}] Seeding complete.`)
    } catch (error) {
      payload.logger.error(
        `❌  [${name}] Seeding failed: ${error instanceof Error ? error.message : 'Unknown error occurred.'}`,
      )
    }
  }

  process.exit(0)
}

seed()
