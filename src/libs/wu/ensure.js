import _ from 'lodash'
import { wu, getDefinition, runFn, setInModel } from './common'

const run = (name) => {
  const definition = getDefinition('ensure', name)
  const result = runFn(definition)
  _.consoleGroup('ensure', 'Ensure: run ' + name, 'Result:', result)
  setInModel(definition, result)
  _.consoleGroupEnd()
}

export default {

  watch: (name) => {
    const definition = getDefinition('ensure', name)
    wu.model.watch(definition.onChange.paths, definition.onChange.check, run.bind(null, name), {
      type: 'ensure'
    })
  }

}
