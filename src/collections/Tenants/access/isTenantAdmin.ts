import { withAuth } from '@/access/helpers'
import type { Access } from 'payload'
import { getTenantRoles } from './helpers'

/**
 * Access control function to check if the user is a tenant admin.
 * Grants access if the user is a system admin or a tenant admin.
 *
 * @param req - The request object containing the authenticated user.
 * @returns - Returns `true` if the user is a system admin, or a `Where` clause that filters tenants based on the user's admin roles.
 */
const isTenantAdmin: Access = withAuth(({ req: { user } }) => {
  if (!user) {
    return false // Deny access if the user is not logged in
  }

  // Use getTenantRoles to retrieve tenant roles
  const adminTenantRoles = getTenantRoles(user).filter(({ roles }) => roles.some((role) => role.name === 'Admin'))

  // Extract tenant IDs where the user has the 'Admin' role
  const adminTenantIds = adminTenantRoles.map(({ tenantId }) => tenantId)

  return adminTenantIds.length > 0
    ? { id: { in: adminTenantIds } } // Return filter if user has admin roles
    : false // Deny access if user has no admin roles
})

export default isTenantAdmin
