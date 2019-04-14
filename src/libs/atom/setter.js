import { atom, getDefinition } from './common'

export default (name, ...args) => {
  const definition = getDefinition('setter', name)
  if (definition) {
    const modelArgs = atom.model.getValues(definition.args)
    const result = definition.fn(...modelArgs.concat(...args))
    atom.model.set(definition.destination, result)
  }
}
