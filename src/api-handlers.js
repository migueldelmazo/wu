import _ from 'lodash'
import { runFn, setInModel } from './common'

const getHandlers = (request) => {
  const definition = _.get(request, 'options.handler')
  let handler = runFn(definition, request.response.raw, request.request, getOptions(request))
  if (!_.isString(handler) || _.isEmpty(handler)) {
    handler = 'status' + request.response.raw.status
  }
  return request.response.raw.error
    ? ['init', handler, 'error', 'complete']
    : ['init', handler, 'success', 'complete']
}

const getOptions = (request) => _.pick(request.options, ['cacheable', 'context', 'fromCache'])

export default {

  runHandlers: (request) => {
    const handlers = getHandlers(request)
    const options = getOptions(request)
    _.each(handlers, (handler) => {
      const definitions = _.get(request.onResponse, handler)
      if (definitions) {
        _.consoleGroup('api', 'API: run handlers.' + handler, definitions)
        _.each(_.parseArray(definitions), (definition) => {
          setInModel(definition, runFn(definition, request.response.raw, request.request, getOptions(request)))
        })
        _.consoleGroupEnd()
      }
    })
  }

}
