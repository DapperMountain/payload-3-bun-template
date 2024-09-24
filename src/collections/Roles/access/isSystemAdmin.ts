import isAuthenticated from '@/access/auth/isAuthenticated'
import { requireAll } from '@/access/helpers'
import { Access, PayloadRequest } from 'payload'

/**
 * Determines if the user has a global admin role.
 *
 * @param userRoles - The roles associated with the user.
 * @returns Boolean indicating whether the user is a global admin.
 */
const isSystemAdmin: Access = requireAll(
  isAuthenticated,
  ({ req }: { req: PayloadRequest }) =>
    req.user?.roles?.some((role) => {
      if (typeof role === 'string') {
        return false
      }

      return role.name === 'Admin'
    }) ?? false,
)
export default isSystemAdmin
