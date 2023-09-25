import _ from 'lodash'
import { isValidSubState } from './wuHelpers'
import { logError, logSet, logReactionEnd, logReactionsEnd, logReactionStart } from './wuLog'

export const state = {}
export const listeners = {}
export const changedPaths = []

// public methods

export const get = (path, defaultValue) => {
  return _.cloneDeep(_.get(state, path, defaultValue))
}

export const set = (subState, logMethod) => {
  // check arguments
  if (subState === undefined) {
    return
  }
  if (!isValidSubState(subState)) {
    logError('subState must be an object:', subState)
  }

  // save previous state to log
  const prevState = _.cloneDeep(state)

  // set subState in state
  for (const path in subState) {
    if (!_.isEqual(_.get(state, path), subState[path])) {
      _.set(state, path, subState[path])
      addChangedPath(path)
    }
  }
  // log
  logSet(logMethod, prevState, subState, state, changedPaths)
}

export const listen = fn => {
  const key = _.uniqueId('l-')
  listeners[key] = fn
  return () => unlisten(key)
}

export const unlisten = key => {
  delete listeners[key]
}

// trigger reactions

let triggerReactionsTimer
let logTriggerReactionsTimer

const addChangedPath = changedPath => {
  if (!changedPaths.includes(changedPath)) {
    changedPaths.push(changedPath)
    clearTimeout(triggerReactionsTimer)
    triggerReactionsTimer = setTimeout(triggertReactions)
  }
}

const triggertReactions = () => {
  while (changedPaths.length) {
    const changedPath = changedPaths.shift()
    const changedListeners = filterListeners(changedPath)
    logReactionStart(changedPath)
    changedListeners.forEach(fn => fn())
    logReactionEnd()
  }
  clearTimeout(logTriggerReactionsTimer)
  logTriggerReactionsTimer = setTimeout(() => logReactionsEnd(state))
}

const filterListeners = changedPath => {
  return _.filter(listeners, listener =>
    listener.wuDeps.some(
      listenerDep =>
        listenerDep === changedPath ||
        changedPath.startsWith(`${listenerDep}.`) ||
        listenerDep.startsWith(`${changedPath}.`) ||
        changedPath.startsWith(`${listenerDep}[`) ||
        listenerDep.startsWith(`${changedPath}[`)
    )
  )
}
