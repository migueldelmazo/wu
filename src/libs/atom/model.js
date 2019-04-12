import _ from 'lodash'
import { atom } from './common'

// atom private items

atom._private.model = {

  data: {},
  watchers: {},

  // watchers

  watch: (paths, fns, options) => {
    paths = parsePaths(paths)
    fns = parseFns(fns)
    options = parseOptions(options)
    if (areValidPaths(paths) && areValidFns(fns)) {
      _.consoleLog('model', 'Listening atom paths: ' + paths)
      const key = getWatcherKey()
      atom._private.model.watchers[key] = parseWatcher(paths, fns, options)
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

const parseWatcher = (paths, fns, options) => {
  return {
    paths,
    fns,
    options
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
  _.consoleGroup('model', 'Trigger model changes', 'Paths:', pendingPaths)
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
  triggerInWatchers(changedPaths, type)
}

const triggerInWatchers = (changedPaths, type) => {
  _.each(atom._private.model.watchers, (watcher) => {
    if (triggerIsValidWatcher(watcher, type) && triggerPathsMatch(changedPaths, watcher.paths)) {
      _.fnsRun(watcher.fns)
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

const triggerPathMatch = (changedPath, watcherPath) => {
  return changedPath === watcherPath ||
    changedPath.indexOf(watcherPath + '.') === 0 ||
    watcherPath.indexOf(changedPath + '.') === 0 ||
    changedPath.indexOf(watcherPath + '[') === 0 ||
    watcherPath.indexOf(changedPath + '[') === 0
}

// get/set

const get = (key, defaultValue) => {
  return _.cloneDeep(_.get(atom._private.model.data, key, defaultValue))
}

const set = (path, newValue, options = {}) => {
  const currentValue = _.get(atom._private.model.data, path)
  if (_.isString(path) && !_.isEqual(currentValue, newValue)) {
    _.set(atom._private.model.data, path, _.cloneDeep(newValue))
    if (options.silent !== true) {
      _.consoleLog('model', 'Set model', path, '=', newValue)
      triggerDebounced(path, options)
    }
  }
}

// atom public methods

export default {

  get,

  getValues: (keys) => {
    return _.map(_.parseArray(keys), (key) => {
      return atom.model.get(key)
    })
  },

  set
}
