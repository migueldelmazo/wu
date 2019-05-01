import _ from 'lodash'
import { runFn, setInModel } from './common'
import { getDefinition, setDefinition } from './definition'

export default {

  setDefinition: (name, definition) => {
    setDefinition('setter', name, definition, {
      args: false,
      run: false,
      update: true
    })
  },

  setter: (name, ...args) => {
    const definition = getDefinition('setter', name)
    if (definition) {
      const result = runFn(definition, ...args)
      _.consoleGroup('setter', 'Setter: run ' + name, 'Result:', result)
      setInModel(definition, result)
      _.consoleGroupEnd()
    } else {
      _.consoleError('Invalid wu.setter name: ' + name)
    }
  }

}
