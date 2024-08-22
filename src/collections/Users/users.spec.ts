import { beforeAll, afterAll, describe, it, expect } from 'bun:test'
import { payload } from '@/test/config'

describe('Users', () => {
  let roleId: string

  beforeAll(async () => {
    // Create a role to associate with the user
    const roleData = {
      name: 'Admin',
      description: 'Administrator role',
    }

    const roleResponse = await payload.create({
      collection: 'roles',
      data: roleData,
    })

    roleId = roleResponse.id // Store the role ID for later use
    expect(typeof roleId).toBe('string') // Validate that roleId is a string
  })

  it('should create a new user with a role', async () => {
    const userData = {
      email: 'testuser@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      roles: [roleId], // Associate the user with the created role
    }

    const response = await payload.create({
      collection: 'users',
      data: userData,
    })

    // Extract role IDs from the response
    const roleIds = response?.roles?.map((role: any) => role.id)

    expect(response.email).toBe(userData.email)
    expect(response.firstName).toBe(userData.firstName)
    expect(response.lastName).toBe(userData.lastName)
    expect(roleIds).toContain(roleId) // Verify the role association
  })

  it('should read an existing user with their role', async () => {
    const userEmail = 'testuser@example.com'

    const response = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: userEmail,
        },
      },
    })

    // Extract role IDs from the response
    const roleIds = response?.docs?.[0]?.roles?.map((role: any) => role.id)

    expect(response.docs.length).toBeGreaterThan(0)
    expect(response.docs[0].email).toBe(userEmail)
    expect(roleIds).toContain(roleId) // Verify the role association
  })

  it("should update an existing user's role", async () => {
    const userEmail = 'testuser@example.com'

    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: userEmail,
        },
      },
    })

    const userId = users.docs?.[0]?.id

    const newRoleData = {
      name: 'Editor',
      description: 'Editor role',
    }

    const newRoleResponse = await payload.create({
      collection: 'roles',
      data: newRoleData,
    })

    const updatedRoleId = newRoleResponse.id

    const response = await payload.update({
      collection: 'users',
      id: userId,
      data: { roles: [updatedRoleId] },
    })

    // Extract role IDs from the response
    const updatedRoleIds = response?.roles?.map((role: any) => role.id)

    expect(updatedRoleIds).toContain(updatedRoleId) // Verify the updated role association
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

    const userId = users.docs?.[0]?.id

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

  afterAll(async () => {
    // Clean up the created role
    await payload.delete({
      collection: 'roles',
      id: roleId,
    })
  })
})
