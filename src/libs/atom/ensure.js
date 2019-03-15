import _ from 'lodash'

const runEnsure = (atom, name) => {
  const itemDefinition = _.get(atom.ensure, name)
  const modelArgs = atom.model.getValues(itemDefinition.args)
  _.consoleGroup('ensure', 'Run ensure: ' + name, 'Definition:', itemDefinition, 'Model args:', modelArgs)
  const result = _.fnRun(itemDefinition.fn, modelArgs)
  atom.model.set(itemDefinition.destination, result)
  _.consoleGroupEnd()
}

export default {

  create: (atom, domains) => {
    _.each(domains, (item, domain) => {
      _.each(item, (itemDefinition, name) => {
        name = domain + '.' + name
        _.consoleGroup('ensure', 'Created ensure: ' + name, 'Definition:', itemDefinition)
        _.set(atom.ensure, name, itemDefinition)
        atom.model.watch(itemDefinition.listeners, runEnsure.bind(null, atom, name), {
          type: 'ensure'
        })
        _.consoleGroupEnd()
      })
    })
  }

}
