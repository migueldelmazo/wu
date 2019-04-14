import _ from 'lodash'
import { atom } from './common'

// atom private items

atom._private.model = {

  data: {},
  watchers: {},

  // watchers

  watch: (paths, fns, validator, options) => {
    paths = parsePaths(paths)
    fns = parseFns(fns)
    options = parseOptions(options)
    if (areValidPaths(paths) && areValidFns(fns)) {
      const key = getWatcherKey()
      atom._private.model.watchers[key] = parseWatcher(paths, fns, validator, options)
      return key
    } else {
      _.consoleError('Atom: model watch definition is invalid', paths, fns)
    }
  },

  stopWatching: (keys) => {
    _.each(_.parseArray(keys), (key) => {
      atom._private.model.watchers[key] = null
    })
  }

}

// watchers helpers

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

const parseWatcher = (paths, fns, validator, options) => {
  return {
    paths,
    fns,
    options,
    validator
  }
}

const areValidPaths = (paths) => {
  return _.every(paths, _.isString)
}

const areValidFns = (fns) => {
  return _.every(fns, _.isFunction)
}

// watchers keys

const getWatcherKey = () => {
  return _.uniqueId('atom-model-key-')
}

// trigger

let onChangeTimer
const pendingPaths = {
  ensure: [],
  watcher: [],
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
  _.each(pendingPaths, (paths, type) => {
    while (!_.isEmpty(pendingPaths[type])) {
      triggerByType(pendingPaths, type)
    }
  })
}

const triggerByType = (pendingPaths, type) => {
  const changedPaths = _.uniq(pendingPaths[type])
  pendingPaths[type] = []
  triggerInWatchers(changedPaths, type)
}

const triggerInWatchers = (changedPaths, type) => {
  _.each(atom._private.model.watchers, (watcher) => {
    if (triggerIsValidWatcher(watcher, type) &&
      triggerPathsMatch(changedPaths, watcher.paths) &&
      triggerValidatorMatch(watcher.validator)) {
      _.consoleGroup('reacting', 'Reacting to model changes', 'Type:', type, 'Paths:', watcher.paths)
      _.fnsRun(watcher.fns)
      _.consoleGroupEnd()
    }
  })
}

const triggerIsValidWatcher = (watcher, type) => {
  return watcher && watcher.options.type === type
}

const triggerPathsMatch = (changedPaths, watcherPaths) => {
  return _.some(changedPaths, (changedPath) => {
    return _.some(watcherPaths, (watcherPath) => {
      return triggerPathMatch(changedPath, watcherPath)
    })
  })
}

const triggerValidatorMatch = (validator) => {
  if (validator) {
    return _.every(validator, (fns, path) => {
      const value = get(path)
      return _.every(_.parseArray(fns), (fn) => {
        return fn(value)
      })
    })
  }
  return true
}

const triggerPathMatch = (changedPath, watcherPath) => {
  return changedPath === watcherPath ||
    changedPath.indexOf(watcherPath + '.') === 0 ||
    watcherPath.indexOf(changedPath + '.') === 0 ||
    changedPath.indexOf(watcherPath + '[') === 0 ||
    watcherPath.indexOf(changedPath + '[') === 0
}

// get/set

const get = (key, defaultValue) => {
  return _.get(atom._private.model.data, key, defaultValue)
}


// atom public methods

export default {

  get: (key, defaultValue) => {
    return _.cloneDeep(get(key, defaultValue))
  },

  getValues: (keys) => {
    return _.map(_.parseArray(keys), (key) => {
      return atom.model.get(key)
    })
  },

  set: (path, newValue, options = {}) => {
    const currentValue = _.get(atom._private.model.data, path)
    if (_.isString(path) && !_.isEqual(currentValue, newValue)) {
      _.set(atom._private.model.data, path, _.cloneDeep(newValue))
      if (options.silent !== true) {
        _.consoleLog('model', 'Model: set', path, '=', newValue)
        triggerDebounced(path, options)
      }
    }
  }
}
