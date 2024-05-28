import { getPayload } from 'payload'
import { importConfig } from 'payload/node'
import addRoles from './Roles'
import addUsers from './Users'

/**
 * Seeds the database, in order
 */
async function seed(): Promise<void> {
  const config = await importConfig('../../payload.config.ts')
  const payload = await getPayload({ config })

  await addRoles(payload)
  await addUsers(payload)
  process.exit(0)
}

seed()
