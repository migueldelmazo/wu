import _ from 'lodash'
import { atom } from './common'

export default {

  create: (domains) => {
    _.each(domains, (item, domain) => {
      _.each(item, (itemDefinition, name) => {
        name = domain + '.' + name
        _.consoleLog('endpoint', 'Created endpoint: ' + name, 'Definition:', itemDefinition)
        _.set(atom.api, name, itemDefinition)
      })
    })
  },

  send: (name) => {
    const endpoint = _.get(atom.api, name)
    if (_.isPlainObject(endpoint)) {
      _.consoleGroup('endpoint', 'Sending endpoint: ' + name + ' ' + endpoint.method + ':' + endpoint.path, 'Endpoint:', endpoint)
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
      _.consoleGroupEnd()
    } else {
      _.consoleError('Atom: ' + name + ' endpoint do not exist')
    }
  }

}
