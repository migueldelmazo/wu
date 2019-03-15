import _ from 'lodash'
import { atom, getDefinition, initDefinition } from './common'

export default {

  listen: (items) => {
    initDefinition(items, (name, definition) => {
      _.set(atom.action, name, definition)
      _.consoleLog('action', 'Listening action: ' + name)
    })
  },

  trigger: (name, ...args) => {
    const definition = getDefinition('action', name)
    _.consoleGroup('action', 'Trigger action: ' + name, 'Args:', ...args)
    _.fnRun(definition, ...args)
    _.consoleGroupEnd()
  }

}
