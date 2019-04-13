import { atom, getDefinition } from './common'

export default (name) => {
  const definition = getDefinition('getter', name)
  const modelArgs = atom.model.getValues(definition.args)
  return definition.fn(modelArgs)
}
