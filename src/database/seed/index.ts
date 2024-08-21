import { getPayload } from 'payload'
import config from '../../payload.config'
import addRoles from './Roles'
import addUsers from './Users'

/**
 * Seeds the database, in order
 */
async function seed(): Promise<void> {
  const payload = await getPayload({ config })

  await addRoles(payload)
  await addUsers(payload)
  process.exit(0)
}

seed()
