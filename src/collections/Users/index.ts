import { boolean } from '@/access'
import isTenantAdmin from '@/collections/Tenants/access/isTenantAdmin'
import { CollectionConfig } from 'payload'
import { access } from './access'
import { hooks } from './hooks'

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: true,
  },
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
    {
      name: 'fullName',
      type: 'text',
      virtual: true,
      admin: {
        hidden: true,
      },
      hooks: {
        // Concatenate `firstName` and `lastName` fields
        afterRead: [({ data }) => `${data?.firstName} ${data?.lastName}`],
      },
    },
    {
      name: 'roles',
      type: 'relationship',
      relationTo: 'roles',
      hasMany: true,
      required: true,
      access: {
        read: () => true,
        create: boolean(isTenantAdmin),
        update: boolean(isTenantAdmin),
      },
      filterOptions: () => ({
        type: {
          equals: 'system',
        },
      }),
    },
    {
      name: 'tenants',
      type: 'array',
      access: {
        read: () => true,
        create: boolean(isTenantAdmin),
        update: boolean(isTenantAdmin),
      },
      fields: [
        {
          name: 'tenant',
          type: 'relationship',
          relationTo: 'tenants',
          required: true,
        },
        {
          name: 'roles',
          type: 'relationship',
          relationTo: 'roles',
          hasMany: true,
          required: true,
          filterOptions: () => ({
            type: {
              equals: 'tenant',
            },
          }),
        },
      ],
    },
  ],
  hooks,
}

export default Users
