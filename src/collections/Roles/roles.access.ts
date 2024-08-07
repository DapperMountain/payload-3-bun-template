import { CollectionConfig } from 'payload'
import { isAdmin, isAuthenticated } from '../../access'

/**
 * Defines access control for the collection.
 */
export const access: CollectionConfig['access'] = {
  read: isAuthenticated,
  update: isAdmin,
  create: isAdmin,
  delete: isAdmin,
}
