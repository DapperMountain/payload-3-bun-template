import { CollectionConfig } from 'payload'
import { boolean, isAdmin, isAuthenticated } from '@/access'

/**
 * Defines access control for the collection.
 */
export const access: CollectionConfig['access'] = {
  read: isAuthenticated,
  create: boolean(isAdmin),
  update: isAdmin,
  delete: isAdmin,
}
