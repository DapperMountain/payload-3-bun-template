import { CollectionConfig } from 'payload'
import { access } from './access'
import { hooks } from './hooks'

const Roles: CollectionConfig = {
  slug: 'roles',
  access,
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'System',
          value: 'system',
        },
        {
          label: 'Tenant',
          value: 'tenant',
        },
      ],
      defaultValue: 'system',
    },
  ],
  hooks,
}

export default Roles
