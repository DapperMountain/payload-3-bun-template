import { Access, AccessArgs, AccessResult } from 'payload'
import { combineAccessResults, evaluateAccessResults } from './accessResults'

/**
 * Requires at least one access function to return `true` to grant full access.
 * If any access function returns an object (such as a `Where` clause), that object is returned to apply filtering or other conditions.
 * If no functions return `true` and no objects are returned, access is denied by returning `false`.
 *
 * @param accessFns - The access functions to evaluate.
 * @returns An access function that returns the combined access result.
 */
export const requireOne = <T = any>(...accessFns: Access<T>[]): Access<T> => {
  return async (args: AccessArgs<T>): Promise<AccessResult> => {
    const results = await evaluateAccessResults(accessFns, args)
    return combineAccessResults(results, 'or', true)
  }
}
