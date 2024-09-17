import { payload } from '@/test/config'
import { createRole, createTenant, createUser, deleteResourceById, findResourceByKey } from '@/test/helpers'
import { Role, Tenant, User } from '@/types'
import { beforeAll, describe, expect, it } from 'bun:test'

describe('[Users]', () => {
  let systemRole: Role
  let tenantRole: Role
  let tenant: Tenant
  let userEmail = 'testuser@example.com'

  // Helper function to verify tenant-role associations for users
  const verifyTenantRoleAssociation = (user: User, expectedTenantId: string, expectedRoleIds: string[]) => {
    const tenantRoles = user.tenants?.map((tenantRole) => ({
      tenantId: (tenantRole.tenant as Tenant).id,
      roleIds: (tenantRole.roles as Role[]).map((role) => role.id),
    }))
    expect(tenantRoles).toContainEqual({ tenantId: expectedTenantId, roleIds: expectedRoleIds })
  }

  beforeAll(async () => {
    // Create tenant and roles
    tenant = await createTenant(payload, { name: 'Test Tenant', description: 'Tenant for testing' })
    systemRole = await createRole(payload, { name: 'User', description: 'Standard user role', type: 'system' })
    tenantRole = await createRole(payload, {
      name: 'Tenant Admin',
      description: 'Admin role for tenants',
      type: 'tenant',
    })
  })

  it('should create a new user with a system role and tenant role', async () => {
    const userData = {
      email: userEmail,
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      roles: [systemRole.id],
      tenants: [
        {
          tenant: tenant.id,
          roles: [tenantRole.id],
        },
      ],
    }

    const createdUser = await createUser(payload, userData)

    // Verify user properties and role-tenant associations
    expect(createdUser.email).toBe(userData.email)
    verifyTenantRoleAssociation(createdUser, tenant.id, [tenantRole.id])
  })

  it('should read an existing user with their role and tenant', async () => {
    const user = await findResourceByKey<User>(payload, 'users', 'email', userEmail)

    // Verify user properties and role-tenant associations
    expect(user.email).toBe(userEmail)
    verifyTenantRoleAssociation(user, tenant.id, [tenantRole.id])
  })

  it("should update an existing user's role and tenant", async () => {
    const user = await findResourceByKey<User>(payload, 'users', 'email', userEmail)

    // Create new tenant-specific role
    const newRole = await createRole(payload, { name: 'Editor', description: 'Editor role', type: 'tenant' })

    // Update user's tenant roles
    const updatedUser = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        tenants: [{ tenant: tenant.id, roles: [newRole.id] }],
      },
    })

    // Verify updated tenant-role associations
    verifyTenantRoleAssociation(updatedUser, tenant.id, [newRole.id])
  })

  it('should delete an existing user', async () => {
    const user = await findResourceByKey<User>(payload, 'users', 'email', userEmail)

    // Delete the user and verify deletion
    await deleteResourceById(payload, 'users', user.id)
  })
})
