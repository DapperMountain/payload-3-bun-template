import { isAuthenticated, isSystemAdmin } from '@/access'
import { CollectionConfig } from 'payload'

/**
 * Defines access control for the collection.
 */
export const access: CollectionConfig['access'] = {
  read: isAuthenticated,
  create: isSystemAdmin,
  update: isSystemAdmin,
  delete: isSystemAdmin,
}
