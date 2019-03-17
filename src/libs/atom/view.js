import _ from 'lodash'
import { atom, initDefinition } from './common'

const runGetter = (name, definition, ...args) => {
  const modelArgs = atom.model.getValues(definition.args)
  args = _.concatArgs(args, modelArgs)
  const result = _.fnRun(definition.fn, ...args)
  _.consoleLog('view', 'Run view: ' + name, 'Args: ', args, 'Result', result)
  return result
}

export default {

  create: (items) => {
    initDefinition(items, (name, definition) => {
      _.consoleLog('view', 'Created view: ' + name, 'Args:', definition.args)
      _.set(atom.view, name, runGetter.bind(null, name, definition))
    })
  }

}
