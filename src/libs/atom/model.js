import _ from 'lodash'

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
  ensure: [],
  default: []
}

const triggerDebounced = (atom, changedPath) => {
  triggerAddPendingPaths(changedPath)
  clearTimeout(onChangeTimer)
  onChangeTimer = setTimeout(trigger.bind(null, atom), 0)
}

const triggerAddPendingPaths = (changedPath) => {
  _.each(pendingPaths, (paths, type) => {
    pendingPaths[type].push(changedPath)
  })
}

const trigger = (atom, changedPath) => {
  _.each(pendingPaths, (paths, type) => {
    while (!_.isEmpty(pendingPaths[type])) {
      triggerByType(atom, pendingPaths, type)
    }
  })
}

const triggerByType = (atom, pendingPaths, type) => {
  const changedPaths = _.uniq(pendingPaths[type])
  pendingPaths[type] = []
  _.consoleGroup('model', 'Model trigger changes (' + type + ')', 'Changed paths:', changedPaths)
  triggerInListeners(atom, changedPaths, type)
  _.consoleGroupEnd()
}

const triggerInListeners = (atom, changedPaths, type) => {
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

export default {

  watch: (atom, paths, fns, options) => {
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

  off: (atom, keys) => {
    _.each(_.parseArray(keys), (key) => {
      atom.model.__listeners[key] = null
    })
  },

  get: (atom, key, defaultValue) => {
    return _.cloneDeep(_.get(atom.model.__data, key, defaultValue))
  },

  getValues: (atom, keys) => {
    return _.map(_.parseArray(keys), (key) => {
      return atom.model.get(key)
    })
  },

  set: (atom, path, newValue) => {
    const currentValue = _.get(atom.model.__data, path)
    if (_.isString(path) && !_.isEqual(currentValue, newValue)) {
      _.consoleLog('model', 'Set model', path, '=', newValue)
      _.set(atom.model.__data, path, newValue)
      triggerDebounced(atom, path)
    }
  }

}
