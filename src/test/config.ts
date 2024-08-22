import { beforeAll, afterAll } from 'bun:test'
import { Payload, getPayload } from 'payload'
import config from '@payload-config'

let payload: Payload

beforeAll(async () => {
  try {
    payload = await getPayload({ config })
  } catch (error) {
    console.error('Error during setup:', error)
    throw error // Re-throw to fail the test if necessary
  }
})

afterAll(async () => {})

export { payload }
