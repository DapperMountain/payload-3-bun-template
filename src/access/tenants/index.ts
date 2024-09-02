import type { Access } from 'payload'
import { isAuthenticated } from '../auth'
import { requireAll, requireOne } from '../helpers'
import { isSystemAdmin } from '../roles'

/**
 * Access control function to check if the user is part of any tenant.
 *
 * @param req - The request object containing the authenticated user.
 * @returns - Returns a `Where` clause that filters tenants based on the user's tenant memberships.
 */
export const isTenant: Access = requireAll(isAuthenticated, async ({ req: { user } }) => {
  // If the user has no tenants, return an empty filter
  const tenantIds = user?.tenants?.map(({ tenant }) => (typeof tenant === 'string' ? tenant : tenant.id)) || []

  // Return the appropriate `Where` clause or empty result
  return tenantIds.length > 0 ? { id: { in: tenantIds } } : { id: { in: [] } } // Empty filter ensures no tenants are returned
})

/**
 * Access control function to check if the user is a tenant admin.
 * Grants access if the user is a system admin or a tenant admin.
 *
 * @param req - The request object containing the authenticated user.
 * @returns - Returns `true` if the user is a system admin, or a `Where` clause that filters tenants based on the user's admin roles.
 */
export const isTenantAdmin: Access = requireOne(
  isSystemAdmin,
  // Check if the user is part of any tenants
  async (args) => isTenant(args) === true,

  // Check if the user has the 'Admin' role in any tenant
  ({ req: { user } }) => {
    const tenantIds =
      user?.tenants
        ?.filter(({ roles }) => roles.includes('Admin'))
        .map(({ tenant }) => (typeof tenant === 'string' ? tenant : tenant.id)) || []

    return tenantIds.length > 0 ? { id: { in: tenantIds } } : false
  },
)
