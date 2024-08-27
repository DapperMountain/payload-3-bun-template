import type { Role, User } from '@/types'
import { Payload } from 'payload'

/**
 * Seeds users into the database if they don't already exist.
 *
 * Defines an array of users to seed, checks if any users with the specified emails already exist,
 * logs a message if they do, and skips the creation.
 *
 * @param {Payload} payload - The Payload instance.
 * @returns {Promise<void>} A promise that resolves when the seeding is complete.
 */
export default async function seed(payload: Payload): Promise<void> {
  const getRoleIdByName = async (name: Role['name']) =>
    (
      await payload.find({
        collection: 'roles',
        pagination: false,
        limit: 1,
        where: {
          name: { equals: name },
        },
        overrideAccess: true,
      })
    )?.docs[0].id as string

  const users: Partial<User>[] = [
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      password: 'admin',
      roles: [await getRoleIdByName('Admin')],
    },
    {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: 'test',
      roles: [await getRoleIdByName('User')],
    },
  ]

  for (const user of users) {
    try {
      // Check if the user already exists
      const exists = (
        await payload.find({
          collection: 'users',
          pagination: false,
          where: {
            email: {
              equals: user.email,
            },
          },
          locale: 'all',
          overrideAccess: true,
        })
      )?.totalDocs

      if (exists) {
        payload.logger.warn(`🚨  [Users] User with email "${user.email}" already exists, skipping.`)
        continue
      }

      // Create the user if they don't exist
      await payload.create({
        collection: 'users',
        data: user as User,
        overrideAccess: true,
      })

      payload.logger.info(`✅  [Users] User "${user.email}" inserted successfully.`)
    } catch (error) {
      payload.logger.error(
        `❌  [Users] Failed to insert user "${user.email}": ${
          error instanceof Error ? error.message : 'Unknown error occurred.'
        }`,
      )
    }
  }
}
