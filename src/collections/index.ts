import { Config } from 'payload'
import Roles from './Roles/roles.schema'
import Tenants from './Tenants/tenants.schema'
import Users from './Users/users.schema'

const collections: Config['collections'] = [Users, Roles, Tenants]

export default collections
