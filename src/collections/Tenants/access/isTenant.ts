import { withAuth } from '@/access/helpers'
import type { Access } from 'payload'
import { getTenantIdsForUser } from './helpers'

/**
 * Access control function to check if the user is part of any tenant for read access.
 *
 * @param req - The request object containing the authenticated user.
 * @returns - Returns a `Where` clause that filters tenants based on the user's tenant memberships.
 */
const isTenant: Access = withAuth(({ req: { user } }) => {
  if (!user) {
    return false // Deny access if the user is not logged in
  }

  // Use helper to get tenant IDs for the user
  const tenantIds = getTenantIdsForUser(user)

  // Return a `Where` clause that restricts the results to the user's tenant IDs
  return tenantIds.length > 0
    ? { id: { in: tenantIds } } // User has tenants, filter by their IDs
    : false // Deny access if the user has no tenants
})

export default isTenant
