import { CollectionConfig } from 'payload'
import { access } from './roles.access'
import { hooks } from './roles.hooks'

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
  ],
  hooks,
}

export default Roles
