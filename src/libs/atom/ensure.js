import _ from 'lodash'
import { atom, getDefinition } from './common'

const runEnsure = (name) => {
  const definition = getDefinition('ensure', name)
  const modelArgs = atom.model.getValues(definition.args)
  const result = definition.fn(modelArgs)
  _.consoleGroup('ensure', 'Run ensure: ' + name, 'Result:', result, 'Args:', modelArgs, 'Definition:', definition)
  atom.model.set(definition.destination, result)
  _.consoleGroupEnd()
}

export default {

  watch: (name) => {
    const definition = getDefinition('ensure', name)
    atom._private.model.watch(definition.watcher, runEnsure.bind(null, name), {
      type: 'ensure'
    })
  }

}
