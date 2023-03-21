import { areValidDeps, getSubState, isValidFn, parseDepsToPaths } from './wuHelpers'
import { logError } from './wuLog'
import { listen, set } from './wuState'

export const wuReact = (fn, deps = []) => {
  // check arguments
  if (!isValidFn(fn)) {
    logError('wuReact: first argument "fn" must be a function.', fn)
  } else if (!areValidDeps(deps)) {
    logError(
      'wuReact: second argument "deps" must be an array of dependencies (string or wuGet function).',
      deps
    )
  } else {
    // create wrapper function
    const reacter = () => {
      const depsValues = getSubState(deps)
      const newSubState = fn(...depsValues)
      set(newSubState, 'wuReact')
    }
    reacter.wuDeps = parseDepsToPaths(deps)
    reacter.wuType = 'wuReact'
    // listen wrapper function
    listen(reacter)
  }
}
