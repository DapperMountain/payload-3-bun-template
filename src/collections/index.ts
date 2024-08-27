import { Config } from 'payload'
import Users from './Users/users.schema'
import Roles from './Roles/roles.schema'

const collections: Config['collections'] = [Users, Roles]

export default collections
