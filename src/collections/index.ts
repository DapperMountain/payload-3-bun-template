import { Config } from 'payload'
import Roles from './Roles'
import Tenants from './Tenants'
import Users from './Users'

const collections: Config['collections'] = [Users, Roles, Tenants]

export default collections
