import _ from 'lodash'
import { wu, runFn } from './common'
import { getDefinition, setDefinition } from './definition'

const run = (name) => {
  const definition = getDefinition('watcher', name)
  _.logStart('watcher', 'Watcher: run ' + name)
  runFn(definition)
  _.logEnd()
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
    if (definition) {
      wu.model.watch(definition.onChange, run.bind(null, name), definition.when)
    }
  }

}
