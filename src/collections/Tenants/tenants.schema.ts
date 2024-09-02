import { CollectionConfig } from 'payload'
import { hooks } from '../Users/users.hooks'
import { access } from './tenants.access'

const Tenants: CollectionConfig = {
  slug: 'tenants',
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
      type: 'textarea',
      required: true,
    },
  ],
  hooks,
}

export default Tenants
