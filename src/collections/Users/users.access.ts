import { CollectionConfig } from 'payload'
import { boolean, isAdmin, isAdminOrSelf } from '../../access'

/**
 * Defines access control for the collection.
 */
export const access: CollectionConfig['access'] = {
  read: isAdminOrSelf,
  create: boolean(isAdmin),
  update: isAdminOrSelf,
  delete: isAdmin,
  admin: boolean(isAdmin),
  unlock: boolean(isAdmin),
}
