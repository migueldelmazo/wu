import _ from 'lodash'

let colors = {}

const getStyles = (type) => {
  return 'background: #' + getStylesColor(type) + ';' +
    'color: white;' +
    'padding: 2px 0px 2px 6px;'
}

const getStylesColor = (type) => {
  return colors[type] || '000'
}

_.mixin({

  consoleConfig: (config) => {
    colors = config.colors
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
