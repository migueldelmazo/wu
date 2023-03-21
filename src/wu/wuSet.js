import { areValidDeps, getSubState, isValidFn, isValidSubState } from './wuHelpers'
import { logError } from './wuLog'
import { set } from './wuState'

export const wuSet = (fnOrSubState, deps) => {
  if (isValidFn(fnOrSubState)) {
    return wuSetWithFn(fnOrSubState, deps)
  } else if (isValidSubState(fnOrSubState)) {
    return wuSetWithSubState(fnOrSubState)
  } else {
    logError(
      'wuSet: first argument "fnOrSubState" must be a function or and sub state object.',
      fnOrSubState
    )
  }
}

const wuSetWithFn = (fn, deps = []) => {
  // check arguments
  if (!areValidDeps(deps)) {
    logError(
      'wuSet: when first argument is a function second argument "deps" be an array of dependencies (string or wuGet function).',
      deps
    )
  } else {
    // create wrapper function
    const setter = (...args) => {
      const depsValues = getSubState(deps)
      const newSubState = fn(...depsValues, ...args)
      set(newSubState, 'wuSet')
    }
    setter.wuType = 'wuSet'
    // return wrapper function
    return setter
  }
}

const wuSetWithSubState = subState => {
  set(subState, 'wuSet')
}
