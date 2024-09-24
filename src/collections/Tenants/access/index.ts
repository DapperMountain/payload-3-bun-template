import isSystemAdmin from '@/collections/Roles/access/isSystemAdmin'
import { CollectionConfig } from 'payload'
import isTenant from './isTenant'
import isTenantAdmin from './isTenantAdmin'

/**
 * Defines access control for the collection.
 */
export const access: CollectionConfig['access'] = {
  read: isTenant,
  create: isSystemAdmin,
  update: isTenantAdmin,
  delete: isTenantAdmin,
}
