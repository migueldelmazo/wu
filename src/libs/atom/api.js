import _ from 'lodash'
import { atom, getDefinition, initDefinition } from './common'

export default {

  create: (items) => {
    initDefinition(items, (name, definition) => {
      _.set(atom.api, name, definition)
      _.consoleLog('endpoint', 'Created endpoint: ' + name, 'Definition:', definition)
    })
  },

  send: (name) => {
    const endpoint = getDefinition('api', name)
    _.consoleLog('endpoint', 'Sending endpoint: ' + name + ' ' + endpoint.method + ':' + endpoint.path, 'Endpoint:', endpoint)
    new Promise((resolve) => {
      setTimeout(() => {
        endpoint.response = {
          userId: 123
        }
        _.consoleGroup('endpoint', 'On endpoint response: ' + name + ' ' + endpoint.method + ':' + endpoint.path, 'Endpoint:', endpoint)
        _.fnRun(endpoint.on.code200, endpoint)
        _.consoleGroupEnd()
      }, 100)
    })
  }

}
