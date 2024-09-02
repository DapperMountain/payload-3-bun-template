import { payload } from '@/test/config'
import { createRole, createTenant, deleteResourceById, findResourceByName } from '@/test/helpers'
import { Role } from '@/types'
import { describe, expect, it } from 'bun:test'

describe('[Roles]', () => {
  let roleId: string
  let tenantId: string

  it('should create a new tenant', async () => {
    const tenantResponse = await createTenant(payload, {
      name: 'Test Tenant',
      description: 'Tenant for testing',
    })
    tenantId = tenantResponse.id
  })

  it('should create a new role', async () => {
    const roleResponse = await createRole(payload, {
      name: 'Admin',
      description: 'Administrator role',
      type: 'tenant', // Assuming roles can have types like 'tenant' or 'system'
    })
    roleId = roleResponse.id

    expect(roleResponse.name).toBe('Admin')
    expect(roleResponse.description).toBe('Administrator role')
  })

  it('should read an existing role', async () => {
    const role = await findResourceByName<Role>(payload, 'roles', 'Admin')

    expect(role.name).toBe('Admin')
  })

  it('should update an existing role', async () => {
    const role = await payload.findByID({
      collection: 'roles',
      id: roleId,
    })

    if (!role) {
      throw new Error('Role not found before update')
    }

    const updatedDescription = 'Updated Administrator role'
    const response = await payload.update({
      collection: 'roles',
      id: roleId,
      data: { description: updatedDescription },
      showHiddenFields: false,
    })

    expect(response.description).toBe(updatedDescription)
  })

  it('should delete an existing role', async () => {
    // Delete the role
    await deleteResourceById(payload, 'roles', roleId)

    // Wait for a short period to ensure deletion has propagated (if necessary)
    await new Promise((resolve) => setTimeout(resolve, 500)) // 500ms delay

    // Attempt to retrieve the deleted role
    const deletedRole = await payload.findByID({
      collection: 'roles',
      id: roleId,
      disableErrors: true, // This prevents the error from being thrown automatically
    })

    // Verify that the role is no longer present
    expect(deletedRole).toBeNull() // Role should no longer exist
  })
})
