import { isSystemAdmin, isSystemAdminOrSelf } from '@/access'
import { CollectionConfig } from 'payload'

/**
 * Defines access control for the collection.
 */
export const access: CollectionConfig['access'] = {
  read: isSystemAdminOrSelf,
  create: isSystemAdmin,
  update: isSystemAdminOrSelf,
  delete: isSystemAdmin,
  //admin: boolean(isSystemAdmin),
  unlock: isSystemAdmin,
}
