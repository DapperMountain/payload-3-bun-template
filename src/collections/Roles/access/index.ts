import isAuthenticated from '@/access/auth/isAuthenticated'
import { CollectionConfig } from 'payload'
import isSystemAdmin from './isSystemAdmin'

/**
 * Defines access control for the collection.
 */
export const access: CollectionConfig['access'] = {
  read: isAuthenticated,
  create: isSystemAdmin,
  update: isSystemAdmin,
  delete: isSystemAdmin,
}
