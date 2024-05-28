import { Payload } from 'payload'
import type { Role } from '../../payload.types'

/**
 * Seeds roles into the database if they don't already exist.
 *
 * This function defines an array of role objects to seed into the database.
 * It first checks if any roles with the same names already exist in the database.
 * If any such roles exist, it throws an error to prevent duplicate role names.
 * If no such roles exist, it proceeds to create a new role record in the database for each role object in the roles array.
 *
 * @param {Payload} payload - The Payload instance to interact with the database.
 * @returns {Promise<void>} A promise that resolves when the seeding process is complete.
 */
export default async function seed(payload: Payload): Promise<void> {
  payload.logger.info('🌱 [Roles] Inserting seed data')

  // Define roles to be seeded to the database
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

  // Checks if any roles with the given names already exist in the database
  const exists = (
    await payload.find({
      collection: 'roles',
      pagination: false,
      where: {
        or: (roles as Role[]).map((role: Role) => ({
          name: {
            equals: role.name,
          },
        })),
      },
      locale: 'all',
      overrideAccess: true,
    })
  )?.totalDocs

  // Throws an error if any roles with the given names already exist in the database
  if (exists) throw Error('Role(s) already exist')

  // Creates a new role record in the database for each role object in the provided roles array
  await Promise.all(
    roles.map(async (role: Partial<Role>) => {
      await payload.create({
        collection: 'roles',
        data: role as Role, // Cast the role object to Role
        locale: null,
        overrideAccess: true,
      })
    }),
  )
}
