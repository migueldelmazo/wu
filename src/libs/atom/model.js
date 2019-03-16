import _ from 'lodash'
import { atom } from './common'

// listeners helpers

const parsePaths = (paths) => {
  return _.isArray(paths) ? _.flattenDeep(paths) : [paths]
}

const parseFns = (fns) => {
  return _.parseArray(fns)
}

const parseOptions = (options) => {
  options = options || {}
  return {
    type: options.type || 'default'
  }
}

const areValidPaths = (paths) => {
  return _.every(paths, _.isString)
}

const areValidFns = (fns) => {
  return _.every(fns, _.isFunction)
}

// listeners keys

const getListernerKey = () => {
  return _.uniqueId('atomModelKey-')
}

// trigger

let onChangeTimer
const pendingPaths = {
  api: [],
  ensure: [],
  default: []
}

const triggerDebounced = (changedPath, options) => {
  triggerAddPendingPaths(changedPath)
  clearTimeout(onChangeTimer)
  onChangeTimer = setTimeout(trigger.bind(null), 0)
}

const triggerAddPendingPaths = (changedPath) => {
  _.each(pendingPaths, (paths, type) => {
    pendingPaths[type].push(changedPath)
  })
}

const trigger = () => {
  _.consoleGroup('model', 'Trigger model changes', pendingPaths)
  _.each(pendingPaths, (paths, type) => {
    while (!_.isEmpty(pendingPaths[type])) {
      triggerByType(pendingPaths, type)
    }
  })
  _.consoleGroupEnd()
}

const triggerByType = (pendingPaths, type) => {
  const changedPaths = _.uniq(pendingPaths[type])
  pendingPaths[type] = []
  triggerInListeners(changedPaths, type)
}

const triggerInListeners = (changedPaths, type) => {
  _.each(atom.model.__listeners, (listener) => {
    if (triggerIsValidListener(listener, type) && triggerPathsMatch(changedPaths, listener.paths)) {
      _.fnsRun(listener.fns)
    }
  })
}

const triggerIsValidListener = (listener, type) => {
  return listener && listener.options.type === type
}

const triggerPathsMatch = (changedPaths, listenerPaths) => {
  return _.some(changedPaths, (changedPath) => {
    return _.some(listenerPaths, (listenerPath) => {
      return triggerPathMatch(changedPath, listenerPath)
    })
  })
}

const triggerPathMatch = (changedPath, listenerPath) => {
  return changedPath === listenerPath ||
    changedPath.indexOf(listenerPath + '.') === 0 ||
    listenerPath.indexOf(changedPath + '.') === 0 ||
    changedPath.indexOf(listenerPath + '[') === 0 ||
    listenerPath.indexOf(changedPath + '[') === 0
}

// get/set

const get = (key, defaultValue) => {
  return _.cloneDeep(_.get(atom.model.__data, key, defaultValue))
}

const set = (path, newValue, options = {}) => {
  const currentValue = _.get(atom.model.__data, path)
  if (_.isString(path) && !_.isEqual(currentValue, newValue)) {
    _.set(atom.model.__data, path, newValue)
    if (options.silent !== true) {
      _.consoleLog('model', 'Set model', path, '=', newValue)
      triggerDebounced(path, options)
    }
  }
}

export default {

  // listeners

  watch: (paths, fns, options) => {
    paths = parsePaths(paths)
    fns = parseFns(fns)
    options = parseOptions(options)
    if (areValidPaths(paths) && areValidFns(fns)) {
      _.consoleLog('model', 'Listening atom paths: ' + paths)
      const key = getListernerKey()
      atom.model.__listeners[key] = {
        paths,
        fns,
        options
      }
      return key
    } else {
      _.consoleWarning('Atom: model watch definition is invalid', paths, fns)
    }
  },

  off: (keys) => {
    _.each(_.parseArray(keys), (key) => {
      atom.model.__listeners[key] = null
    })
  },

  // getters

  get,

  getValues: (keys) => {
    return _.map(_.parseArray(keys), (key) => {
      return atom.model.get(key)
    })
  },

  // setters

  set
}
