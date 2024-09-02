import { isSystemAdmin, isTenant, isTenantAdmin } from '@/access'
import { CollectionConfig } from 'payload'

/**
 * Defines access control for the collection.
 */
export const access: CollectionConfig['access'] = {
  read: isTenant,
  create: isSystemAdmin,
  update: isTenantAdmin,
  delete: isTenantAdmin,
}
