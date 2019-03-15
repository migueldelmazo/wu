import _ from 'lodash'
import { atom, initDefinition } from './common'

const runGetter = (name, definition, ...args) => {
  const modelArgs = atom.model.getValues(definition.args)
  args = _.concatArgs(args, modelArgs)
  const result = _.fnRun(definition.fn, ...args)
  _.consoleLog('getter', 'Run getter: ' + name, 'Args: ', args, 'Result', result)
  return result
}

export default {

  create: (items) => {
    initDefinition(items, (name, definition) => {
      _.consoleLog('getter', 'Created getter: ' + name, 'Args:', definition.args)
      _.set(atom.getter, name, runGetter.bind(null, name, definition))
    })
  }

}
