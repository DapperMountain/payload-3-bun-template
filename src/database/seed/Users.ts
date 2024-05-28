import { Payload } from 'payload'
import type { Role, User } from '../../payload.types'

/**
 * Seeds users into the database if they don't already exist.
 *
 * Defines an array of users to seed, checks if any users with the specified emails already exist,
 * throws an error if they do, and creates a new user record for each user object if no such users exist.
 *
 * @param {Payload} payload - The Payload instance.
 * @returns {Promise<void>} A promise that resolves when the seeding is complete.
 */
export default async function seed(payload: Payload): Promise<void> {
  payload.logger.info('🌱 [Users] Inserting seed data')

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

  // Define users to be seeded to the database
  const users: Partial<User>[] = [
    // Admin user
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      password: 'admin',
      roles: [await (async () => getRoleIdByName('Admin'))()],
    },
    // Regular user
    {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: 'test',
      roles: [await (async () => getRoleIdByName('User'))()],
    },
  ]

  // Checks if any users with the given emails already exist in the database
  const exists = (
    await payload.find({
      collection: 'users',
      pagination: false,
      where: {
        or: users.map((user: Partial<User>) => ({
          email: {
            equals: user.email,
          },
        })),
      },
      locale: 'all',
      overrideAccess: true,
    })
  )?.totalDocs

  // Throws an error if any users with the given emails already exist in the database
  if (exists) throw Error('User(s) already exist')

  // Creates a new user record in the database for each user object in the provided users array
  await Promise.all(
    users.map(async (user: Partial<User>) => {
      // Change the type of the 'user' parameter to 'Partial<User>'
      await payload.create({
        collection: 'users',
        data: user as User,
        locale: null,
        overrideAccess: true,
      })
    }),
  )
}
