import { useEffect, useState } from 'react'
import { areValidDeps, getSubState, isValidFn, isValidPath, parseDepsToPaths } from './wuHelpers'
import { logError } from './wuLog'
import { get, listen } from './wuState'

export const wuGet = (fn, deps = []) => {
  // check arguments
  if (!isValidFn(fn)) {
    logError('wuGet: first argument "fn" must be a function.', fn)
  } else if (!areValidDeps(deps)) {
    logError('wuGet: second argument "deps" must be an array of strings.', deps)
  }
  // create wrapper function
  const getter = (...args) => {
    const depsValues = getSubState(deps)
    return fn(...depsValues, ...args)
  }
  getter.wuDeps = parseDepsToPaths(deps)
  getter.wuType = 'wuGet'
  // return wrapper function
  return getter
}

export const useWuGet = (deps, ...args) => {
  // check arguments
  if (!isValidPath(deps) && !isValidFn(deps)) {
    logError('useWuGet: first argument "deps" must be a string or a wuGet funcion.', deps)
  }
  // rename arguments
  const fn = deps
  const defaultValue = args[0]
  // create React state
  const [, setCounter] = useState(0)
  // create wrapper function
  const getter = () => setCounter(counter => counter + 1)
  getter.wuDeps = parseDepsToPaths(deps)
  getter.wuType = 'useWuGet'
  // listen wu state changes
  useEffect(() => listen(getter))
  // return Wu state value
  return isValidPath(deps) ? get(deps, defaultValue) : fn(...args)
}
