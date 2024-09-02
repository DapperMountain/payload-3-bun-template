import { isAuthenticated, requireAll, requireOne } from '@/access'
import { Access, PayloadRequest } from 'payload'

/**
 * Determines if the user has a global admin role.
 *
 * @param userRoles - The roles associated with the user.
 * @returns Boolean indicating whether the user is a global admin.
 */
export const isSystemAdmin: Access = requireAll(
  isAuthenticated,
  async ({ req }) =>
    req.user?.roles?.some((role) => {
      if (typeof role === 'string') {
        return false
      }

      return role.name === 'Admin'
    }) ?? false,
)

/**
 * Checks if the user is requesting their own record based on authentication and comparing the requested ID to the
 * authenticated user's ID. Returns false if user is not authenticated.
 */
export const isSelf: Access = requireAll(isAuthenticated, ({ req }: { req: PayloadRequest }) => ({
  id: {
    equals: req?.user?.id,
  },
}))

/**
 * Returns an access function that evaluates isSystemAdmin and isSelf asynchronously. Requires at least one to return true.
 */
export const isSystemAdminOrSelf: Access = requireOne(isSystemAdmin, isSelf)
