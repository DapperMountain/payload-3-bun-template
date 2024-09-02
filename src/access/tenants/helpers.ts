import { Role, Tenant, User } from '@/types'

/**
 * Retrieves the user's roles associated with specific tenants.
 *
 * @param user - The user object containing tenant roles.
 * @param tenantIds - The tenant IDs to filter by (optional).
 * @returns The roles associated with the given tenants.
 */
export const getTenantRoles = (user: User, tenantIds: string[] = []): Role[] => {
  return (
    user.tenants
      ?.filter((tenant) => tenantIds.includes(typeof tenant.tenant === 'string' ? tenant.tenant : tenant.tenant.id))
      .flatMap((tenant) => tenant.roles as Role[]) ?? []
  )
}

// Helper function to determine tenant IDs the user is part of
export const getTenantIdsForUser = (user: any): string[] => {
  return user?.tenants?.map(({ tenant }: { tenant: Tenant }) => (typeof tenant === 'string' ? tenant : tenant.id)) || []
}
