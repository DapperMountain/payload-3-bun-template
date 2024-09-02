import { Access, AccessArgs, AccessResult, Where } from 'payload'
import { isFilter } from './isFilter'
import { isPromise } from './isPromise'

/**
 * Evaluates an array of access functions and returns their results as a promise.
 * Handles both synchronous and asynchronous access functions, ensuring all results are resolved.
 *
 * @param funcs - The access functions to evaluate.
 * @param args - The arguments to pass to each access function.
 * @returns A promise that resolves to an array of access results (boolean or Where clause).
 */
export const evaluateAccessResults = async (funcs: Access[], args: AccessArgs): Promise<(boolean | Where)[]> => {
  return Promise.all(
    funcs.map(async (func) => {
      const result = func(args)
      return isPromise(result) ? await result : result
    }),
  )
}

/**
 * Combines the results of access functions based on a specified logic (e.g., `and` or `or`).
 *
 * @param results - The results of the evaluated access functions.
 * @param logic - The logic to combine multiple `Where` clauses (`and` or `or`).
 * @param fullAccessCheck - The condition to grant full access (`true` or `false`).
 * @returns The combined access result based on the logic.
 */
export const combineAccessResults = (
  results: AccessResult[],
  logic: 'and' | 'or',
  fullAccessCheck: boolean,
): AccessResult => {
  if (results.some((result) => result === fullAccessCheck)) return fullAccessCheck

  const filters = results.filter(isFilter)

  if (filters.length === 0) return !fullAccessCheck

  if (filters.length === 1) return filters[0]

  return { [logic]: filters }
}
