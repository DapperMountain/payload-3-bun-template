import { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrSelf } from '../../access'

/**
 * Defines access control for the collection.
 */
export const access: CollectionConfig['access'] = {
  read: isAdminOrSelf,
  update: isAdminOrSelf,
  create: isAdmin,
  delete: isAdmin,
}
