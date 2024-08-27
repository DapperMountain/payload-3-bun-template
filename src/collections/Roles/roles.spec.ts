import { payload } from '@/test/config'
import { describe, expect, it } from 'bun:test'

describe('[Roles]', () => {
  it('should create a new role', async () => {
    const roleData = {
      name: 'Admin',
      description: 'Administrator role',
    }

    const response = await payload.create({
      collection: 'roles',
      data: roleData,
    })

    expect(response.name).toBe(roleData.name)
    expect(response.description).toBe(roleData.description)
  })

  it('should read an existing role', async () => {
    const roleName = 'Admin'

    const response = await payload.find({
      collection: 'roles',
      where: {
        name: {
          equals: roleName,
        },
      },
    })

    expect(response.docs.length).toBeGreaterThan(0)
    expect(response.docs[0].name).toBe(roleName)
  })

  it('should update an existing role', async () => {
    const roleName = 'Admin'
    const updatedDescription = 'Updated Administrator role'

    const roles = await payload.find({
      collection: 'roles',
      where: {
        name: {
          equals: roleName,
        },
      },
    })

    const roleId = roles.docs?.[0]?.id

    const response = await payload.update({
      collection: 'roles',
      id: roleId,
      data: { description: updatedDescription },
      showHiddenFields: false,
    })

    expect(response.description).toBe(updatedDescription)
  })

  it('should delete an existing role', async () => {
    const roleName = 'Admin'

    const roles = await payload.find({
      collection: 'roles',
      where: {
        name: {
          equals: roleName,
        },
      },
    })

    const roleId = roles.docs?.[0]?.id

    await payload.delete({
      collection: 'roles',
      id: roleId,
    })

    // Verify that the role was deleted
    const verifyResponse = await payload.find({
      collection: 'roles',
      where: {
        id: {
          equals: roleId,
        },
      },
    })

    expect(verifyResponse.docs.length).toBe(0)
  })
})
