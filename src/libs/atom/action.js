import _ from 'lodash'
import { atom } from './common'

export default {

  listen: (domains) => {
    _.each(domains, (item, domain) => {
      _.each(item, (fn, name) => {
        name = domain + '.' + name
        _.consoleLog('action', 'Listening action: ' + name)
        _.set(atom.action, name, fn)
      })
    })
  },

  trigger: (name, ...args) => {
    const fn = _.get(atom.action, name)
    if (_.isFunction(fn)) {
      _.consoleGroup('action', 'Trigger action: ' + name, 'Args:', ...args)
      _.fnRun(fn, ...args)
      _.consoleGroupEnd()
    } else {
      _.consoleError('Atom: ' + name + ' action do not exist')
    }
  }

}
