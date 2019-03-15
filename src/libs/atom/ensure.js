import _ from 'lodash'
import { atom, getDefinition, initDefinition } from './common'

const runEnsure = (name) => {
  const definition = getDefinition('ensure', name)
  const modelArgs = atom.model.getValues(definition.args)
  _.consoleGroup('ensure', 'Run ensure: ' + name, 'Definition:', definition, 'Model args:', modelArgs)
  const result = _.fnRun(definition.fn, modelArgs)
  atom.model.set(definition.destination, result)
  _.consoleGroupEnd()
}

export default {

  create: (items) => {
    initDefinition(items, (name, definition) => {
      _.set(atom.ensure, name, definition)
      _.consoleGroup('ensure', 'Created ensure: ' + name, 'Definition:', definition)
      atom.model.watch(definition.listeners, runEnsure.bind(null, name), { type: 'ensure' })
      _.consoleGroupEnd()
    })
  }

}
