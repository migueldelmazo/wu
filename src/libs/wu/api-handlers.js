import _ from 'lodash'
import { runFn, setInModel } from './common'

export default {

  setHandler: (request) => {
    request.response.handler = 'onCode' + request.response.raw.status
  },

  runHandler: (request, handler) => {
    handler = _.get(request.handlers, handler)
    _.each(handler, (definition) => {
      setInModel(definition, runFn(definition, request.response.raw, request))
    })
  }

}
