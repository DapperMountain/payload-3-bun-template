import { payload } from '@/test/config'
import { Role, Tenant, User } from '@/types'
import { beforeAll, describe, expect, it } from 'bun:test'

describe('[Users]', () => {
  let systemRoleId: string
  let tenantRoleId: string
  let tenantId: string

  beforeAll(async () => {
    // Create a tenant
    const tenantData = {
      name: 'Test Tenant',
      description: 'Tenant for testing',
    }

    const tenantResponse = await payload.create({
      collection: 'tenants',
      data: tenantData,
    })

    tenantId = tenantResponse.id as string
    expect(typeof tenantId).toBe('string')

    // Create a system role
    const systemRoleData = {
      name: 'User',
      description: 'Standard user role',
      type: 'system' as const,
    }

    const systemRoleResponse = await payload.create({
      collection: 'roles',
      data: systemRoleData,
    })

    systemRoleId = systemRoleResponse.id as string
    expect(typeof systemRoleId).toBe('string')

    // Create a tenant role
    const tenantRoleData = {
      name: 'Tenant Admin',
      description: 'Administrator role for a tenant',
      type: 'tenant' as const,
    }

    const tenantRoleResponse = await payload.create({
      collection: 'roles',
      data: tenantRoleData,
    })

    tenantRoleId = tenantRoleResponse.id as string
    expect(typeof tenantRoleId).toBe('string')
  })

  it('should create a new user with a system role and tenant role', async () => {
    const userData = {
      email: 'testuser@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      roles: [systemRoleId], // System role assigned directly
      tenants: [
        {
          tenant: tenantId,
          roles: [tenantRoleId], // Tenant role assigned within the tenant array
        },
      ],
    }

    const response = (await payload.create({
      collection: 'users',
      data: userData,
    })) as User

    const tenantRoles = response.tenants?.map((tenantRole) => ({
      tenantId: (tenantRole.tenant as Tenant).id,
      roleIds: (tenantRole.roles as Role[]).map((role) => role.id),
    }))

    expect(response.email).toBe(userData.email)
    expect(response.firstName).toBe(userData.firstName)
    expect(response.lastName).toBe(userData.lastName)
    expect(tenantRoles).toContainEqual({ tenantId, roleIds: [tenantRoleId] }) // Verify tenant and role association
  })

  it('should read an existing user with their role and tenant', async () => {
    const userEmail = 'testuser@example.com'

    const response = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: userEmail,
        },
      },
    })

    const user = response.docs[0] as User

    const tenantRoles = user?.tenants?.map((tenantRole) => ({
      tenantId: (tenantRole.tenant as Tenant).id,
      roleIds: (tenantRole.roles as Role[]).map((role) => role.id),
    }))

    expect(response.docs.length).toBeGreaterThan(0)
    expect(user?.email).toBe(userEmail)
    expect(tenantRoles).toContainEqual({ tenantId, roleIds: [tenantRoleId] }) // Verify tenant and role association
  })

  it("should update an existing user's role and tenant", async () => {
    const userEmail = 'testuser@example.com'

    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: userEmail,
        },
      },
    })

    const userId = users?.docs?.[0]?.id

    // Create a new tenant-specific role
    const newRoleData = {
      name: 'Editor',
      description: 'Editor role',
      type: 'tenant' as const,
    }

    const newRoleResponse = await payload.create({
      collection: 'roles',
      data: newRoleData,
    })

    const updatedRoleId = newRoleResponse.id as string

    const response = (await payload.update({
      collection: 'users',
      id: userId,
      data: {
        tenants: [
          {
            tenant: tenantId,
            roles: [updatedRoleId], // Update with new roles array
          },
        ],
      },
    })) as User

    const updatedTenantRoles = response.tenants?.map((tenantRole) => ({
      tenantId: (tenantRole.tenant as Tenant).id,
      roleIds: (tenantRole.roles as Role[]).map((role) => role.id),
    }))

    expect(updatedTenantRoles).toContainEqual({ tenantId, roleIds: [updatedRoleId] }) // Verify updated tenant and role association
  })

  it('should delete an existing user', async () => {
    const userEmail = 'testuser@example.com'

    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: userEmail,
        },
      },
    })

    const userId = users?.docs?.[0]?.id

    await payload.delete({
      collection: 'users',
      id: userId,
    })

    // Verify that the user was deleted
    const verifyResponse = await payload.find({
      collection: 'users',
      where: {
        id: {
          equals: userId,
        },
      },
    })

    expect(verifyResponse.docs.length).toBe(0)
  })
})
