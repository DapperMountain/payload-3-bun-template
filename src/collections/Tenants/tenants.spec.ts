import { payload } from '@/test/config'
import { createTenant, deleteResourceById, findResourceByName } from '@/test/helpers'
import { Tenant } from '@/types'
import { afterAll, describe, expect, it } from 'bun:test'

describe('[Tenants]', () => {
  let tenantId: string

  it('should create a new tenant', async () => {
    const tenantResponse = await createTenant(payload, {
      name: 'Test Tenant',
      description: 'Tenant for testing',
    })
    tenantId = tenantResponse.id

    expect(tenantResponse.name).toBe('Test Tenant')
    expect(tenantResponse.description).toBe('Tenant for testing')
  })

  it('should read an existing tenant', async () => {
    const tenant = await findResourceByName<Tenant>(payload, 'tenants', 'Test Tenant')
    expect(tenant.name).toBe('Test Tenant')
  })

  it('should update an existing tenant', async () => {
    const updatedDescription = 'Updated tenant for testing'
    const response = await payload.update({
      collection: 'tenants',
      id: tenantId,
      data: { description: updatedDescription },
    })

    expect(response.description).toBe(updatedDescription)
  })

  it('should delete an existing tenant', async () => {
    await deleteResourceById(payload, 'tenants', tenantId)
  })

  afterAll(async () => {
    // Cleanup if necessary
  })
})
