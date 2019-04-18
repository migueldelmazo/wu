import _ from 'lodash'
import { runFn, setInModel } from './common'

export default {

  runActions: (request) => {
    const handler = _.get(request.handlers, 'onCode' + request.response.raw.status)
    _.each(handler, (definition) => {
      setInModel(definition, runFn(definition, request.response.raw, request.request))
    })
  }

}
