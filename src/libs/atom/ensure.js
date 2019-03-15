import _ from 'lodash'
import { atom } from './common'

const runEnsure = (name) => {
  const itemDefinition = _.get(atom.ensure, name)
  const modelArgs = atom.model.getValues(itemDefinition.args)
  _.consoleGroup('ensure', 'Run ensure: ' + name, 'Definition:', itemDefinition, 'Model args:', modelArgs)
  const result = _.fnRun(itemDefinition.fn, modelArgs)
  atom.model.set(itemDefinition.destination, result)
  _.consoleGroupEnd()
}

export default {

  create: (domains) => {
    _.each(domains, (item, domain) => {
      _.each(item, (itemDefinition, name) => {
        name = domain + '.' + name
        _.consoleGroup('ensure', 'Created ensure: ' + name, 'Definition:', itemDefinition)
        _.set(atom.ensure, name, itemDefinition)
        atom.model.watch(itemDefinition.listeners, runEnsure.bind(null, name), {
          type: 'ensure'
        })
        _.consoleGroupEnd()
      })
    })
  }

}
