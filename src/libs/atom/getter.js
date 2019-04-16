import _ from 'lodash'
import { atom, getDefinition } from './common'

export default (name, ...args) => {
  const definition = getDefinition('getter', name)
  if (definition) {
    const modelArgs = atom.model.getValues(definition.args)
    return _.isFunction(definition.fn)
      ? definition.fn(...modelArgs.concat(...args))
      : modelArgs[0]
  }
}
