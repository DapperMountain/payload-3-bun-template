import { isSelf, isSystemAdmin } from '@/access'
import { CollectionConfig } from 'payload'

/**
 * Defines access control for the collection.
 */
export const access: CollectionConfig['access'] = {
  read: isSelf,
  create: isSystemAdmin,
  update: isSelf,
  delete: isSystemAdmin,
  //admin: boolean(isSystemAdmin),
  unlock: isSystemAdmin,
}
