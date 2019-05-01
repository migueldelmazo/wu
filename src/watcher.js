import _ from 'lodash'
import { wu, runFn } from './common'
import { getDefinition, setDefinition } from './definition'

const run = (name) => {
  const definition = getDefinition('watcher', name)
  _.consoleGroup('watcher', 'Watcher: run ' + name)
  runFn(definition)
  _.consoleGroupEnd()
}

export default {

  setDefinition: (name, definition) => {
    setDefinition('watcher', name, definition, {
      onChange: true,
      when: false,
      args: false,
      run: true
    })
  },

  watch: (name) => {
    const definition = getDefinition('watcher', name)
    wu.model.watch(definition.onChange, run.bind(null, name), definition.when)
  }

}
