import _ from 'lodash'

export default {

  listen: (atom, domains) => {
    _.each(domains, (item, domain) => {
      _.each(item, (fn, name) => {
        name = domain + '.' + name
        _.consoleLog('action', 'Listening action: ' + name)
        _.set(atom.action, name, fn)
      })
    })
  },

  trigger: (atom, name, ...args) => {
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
