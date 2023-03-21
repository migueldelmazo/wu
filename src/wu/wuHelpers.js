import _ from 'lodash'
import { get } from './wuState'

export const areValidDeps = deps => {
  return _.isArray(deps) && deps.every(isValidDep)
}

export const isValidDep = dep => {
  return isValidPath(dep) || (_.isFunction(dep) && dep.wuType === 'wuGet')
}

export const isValidFn = fn => {
  return _.isFunction(fn)
}

export const isValidPath = dep => {
  return _.isString(dep)
}

export const isValidSubState = subState => {
  return _.isPlainObject(subState)
}

export const getSubState = (deps = []) => {
  return deps.map(strOrFn => (_.isString(strOrFn) ? get(strOrFn) : strOrFn()))
}

export const parseDepsToPaths = (deps = []) => {
  const depsArray = _.isArray(deps) ? deps : [deps]
  const strings = depsArray.map(strOfFn => (_.isString(strOfFn) ? strOfFn : strOfFn.wuDeps))
  return _.flatten(strings)
}
