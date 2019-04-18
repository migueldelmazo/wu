import _ from 'lodash'
import { getDefinition, runFn } from './common'

export default (name, ...args) => {
  const definition = getDefinition('getter', name)
  if (definition) {
    const result = runFn(definition, ...args)
    _.consoleLog('getter', 'Getter: run ' + name, 'Result:', result)
    return result
  } else {
    _.consoleError('Invalid wu.getter name: ' + name)
  }
}
