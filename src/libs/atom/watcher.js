import _ from 'lodash'
import { atom, getDefinition } from './common'

const runWatcher = (name) => {
  const definition = getDefinition('watcher', name)
  const modelArgs = atom.model.getValues(definition.args)
  _.consoleGroup('watcher', 'Run watcher: ' + name, 'Args:', modelArgs, 'Definition:', definition)
  definition.fn(modelArgs)
  _.consoleGroupEnd()
}

export default {

  watch: (name) => {
    const definition = getDefinition('watcher', name)
    atom._private.model.watch(definition.watcher, runWatcher.bind(null, name))
  }

}
