import _ from 'lodash'
import { getDefinition, runFn, setInModel } from './common'

export default (name, ...args) => {
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
