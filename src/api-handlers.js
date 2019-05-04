import _ from 'lodash'
import { runFn, setInModel } from './common'

const getHandlers = (request) => {
  const handler = _.has(request, 'onResponse.getHandler')
    ? runFn(_.get(request, 'onResponse.getHandler'), request.response.raw, request)
    : 'status' + request.response.raw.status
  return request.response.raw.error
    ? ['init', handler, 'error', 'complete']
    : ['init', handler, 'success', 'complete']
}

export default {

  runHandlers: (request) => {
    const handlers = getHandlers(request)
    _.each(handlers, (handler) => {
      const definitions = _.get(request.onResponse, handler)
      if (definitions) {
        _.consoleGroup('api', 'API: run handlers.' + handler, definitions)
        _.each(_.parseArray(definitions), (definition) => {
          setInModel(definition, runFn(definition, request.response.raw, request))
        })
        _.consoleGroupEnd()
      }
    })
  }

}
