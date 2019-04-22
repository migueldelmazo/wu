import _ from 'lodash'
import { wu, getDefinition, runFn, setInModel } from './common'

const run = (name) => {
  const definition = getDefinition('ensurer', name)
  const result = runFn(definition)
  _.consoleGroup('ensurer', 'Ensurer: run ' + name, 'Result:', result)
  setInModel(definition, result)
  _.consoleGroupEnd()
}

export default {

  watch: (name) => {
    const definition = getDefinition('ensurer', name)
    wu.model.watch(definition.onChange.paths, definition.onChange.check, run.bind(null, name), {
      type: 'ensurer'
    })
  }

}
