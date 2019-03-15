import _ from 'lodash'
import { atom } from './common'

const runGetter = (name, itemDefinition, ...args) => {
  const modelArgs = atom.model.getValues(itemDefinition.args)
  _.each(modelArgs, (modelArg) => args.unshift(modelArg))
  const result = _.fnRun(itemDefinition.fn, ...args)
  _.consoleLog('getter', 'Run getter: ' + name, 'Args: ', args, 'Result', result)
  return result
}

export default {

  create: (domains) => {
    _.each(domains, (item, domain) => {
      _.each(item, (itemDefinition, name) => {
        name = domain + '.' + name
        _.consoleLog('getter', 'Created getter: ' + name, 'Args:', itemDefinition.args)
        _.set(atom.getter, name, runGetter.bind(null, name, itemDefinition))
      })
    })
  }

}
