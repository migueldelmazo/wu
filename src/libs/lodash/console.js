import _ from 'lodash'

let config = {}

const getStyles = (type) => {
  return config && config.styles ? config.styles[type] : ''
}

_.mixin({

  consoleConfig: (_config) => {
    config = _config
  },

  consoleGroup: (type, name, ...args) => {
    console.group('%c' + name + ' ', getStyles(type), ..._.cloneDeep(args))
  },

  consoleGroupEnd: () => {
    console.groupEnd()
  },

  consoleLog: (type, name, ...args) => {
    console.log('%c' + name + ' ', getStyles(type), ..._.cloneDeep(args))
  },

  consoleError: (...args) => {
    console.error(...args)
  },

  consoleWarning: (...args) => {
    console.warn(...args)
  }

})
