import { Role } from '@/types'
import { AccessArgs, PayloadRequest, Where } from 'payload'

type AccessResult = Where | boolean
type AccessFunction<T = Record<string, unknown>> = (args: AccessArgs<T>) => AccessResult | Promise<AccessResult>
type BooleanAccessFunction<T = Record<string, unknown>> = (args: AccessArgs<T>) => boolean | Promise<boolean>

/**
 * Evaluates multiple access functions asynchronously and combines their results.
 *
 * @param accessFns - The access functions to evaluate.
 * @param args - The arguments to pass to each access function.
 * @param combineResults - Function that combines the results into a single result.
 * @returns The combined access result.
 */
const evalAccessFunctions = async <T>(
  accessFns: AccessFunction<T>[],
  args: AccessArgs<T>,
  combineResults: (results: AccessResult[]) => AccessResult,
): Promise<AccessResult> => {
  const results = await Promise.all(accessFns.map((accessFn) => accessFn(args)))
  return combineResults(results)
}

/**
 * Adapts an access function to automatically return the appropriate type based on the context.
 */
export const boolean = <T>(accessFn: AccessFunction<T>): BooleanAccessFunction<T> => {
  return async (args: AccessArgs<T>) => {
    const result = await accessFn(args)
    return typeof result === 'object' && result !== null ? true : !!result
  }
}

/**
 * Returns an access function that evaluates the provided access functions asynchronously and requires at least one to
 * return an object result or all to return true. Combines the results using the provided callback.
 */
export const requireOne =
  <T>(...accessFns: AccessFunction<T>[]): ((args: AccessArgs<T>) => Promise<AccessResult>) =>
  async (args: AccessArgs<T>) =>
    evalAccessFunctions(
      accessFns,
      args,
      (results) => results.find((result) => typeof result === 'object') ?? results.some((result) => result === true),
    )

/**
 * Returns an access function that evaluates the provided access functions asynchronously and requires all to return
 * true. Combines the results using the provided callback.
 */
export const requireAll =
  <T>(...accessFns: AccessFunction<T>[]): ((args: AccessArgs<T>) => Promise<AccessResult>) =>
  async (args: AccessArgs<T>) =>
    evalAccessFunctions(accessFns, args, (results) =>
      results.every((result) => result === true) ? true : results.find((result) => typeof result === 'object') ?? false,
    )

/**
 * Checks if the user is authenticated based on the presence of a user object on the request.
 */
export const isAuthenticated = async ({ req }: { req: PayloadRequest }) => Boolean(req.user)

/**
 * Checks if the user is an admin based on authentication and their roles. Returns false if user is not authenticated.
 * Returns an object that represents a condition that allows access to all records if the user is an admin.
 */
export const isAdmin: AccessFunction = async ({ req }: { req: PayloadRequest }) => {
  if (!(await isAuthenticated({ req }))) return false
  const isAdmin = Boolean(req.user?.roles?.find((role) => (role as Role).name === 'Admin'))
  return isAdmin ? {} : false
}

/**
 * Checks if the user is requesting their own record based on authentication and comparing the requested ID to the
 * authenticated user's ID. Returns false if user is not authenticated.
 */
export const isSelf: AccessFunction = async ({ req }: { req: PayloadRequest }) => {
  if (!(await isAuthenticated({ req }))) return false
  return { id: { equals: req.user?.id } }
}

/**
 * Returns an access function that evaluates isAdmin and isSelf asynchronously. Requires at least one to return true.
 */
export const isAdminOrSelf = requireOne(isAdmin, isSelf)
