import { CollectionConfig } from 'payload'
import { access } from './users.access'
import { hooks } from './users.hooks'
import { boolean, isAdmin } from '@/access'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access,
  admin: {
    useAsTitle: 'fullName',
    listSearchableFields: ['firstName', 'lastName'],
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    // `fullName` virtual field
    {
      name: 'fullName',
      type: 'text',
      admin: {
        hidden: true,
      },
      hooks: {
        // Ensure `fullName` field doesn't get passed to the database
        beforeChange: [
          ({ siblingData }) => {
            delete siblingData['fullName']
          },
        ],
        // Concatenate `firstName` and `lastName` fields
        afterRead: [({ data }) => `${data?.firstName} ${data?.lastName}`],
      },
    },
    {
      name: 'roles',
      type: 'relationship',
      relationTo: 'roles',
      hasMany: true,
      access: {
        read: () => true,
        create: boolean(isAdmin),
        update: boolean(isAdmin),
      },
    },
  ],
  hooks,
}

export default Users
