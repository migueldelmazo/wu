import _ from 'lodash'
import { atom, getDefinition, runFn } from './common'

const run = (name) => {
  const definition = getDefinition('watcher', name)
  _.consoleGroup('watcher', 'Watcher: run ' + name)
  runFn(definition)
  _.consoleGroupEnd()
}

export default {

  watch: (name) => {
    const definition = getDefinition('watcher', name)
    atom.model.watch(definition.onChange.paths, definition.onChange.check, run.bind(null, name))
  }

}
