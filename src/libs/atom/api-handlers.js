import _ from 'lodash'
import { atom } from './common'

export default {

  runActions: (request) => {
    const handler = _.get(request.handlers, 'onCode' + request.response.raw.status)
    if (handler) {
      _.each(handler, (action) => {
        const value = _.get(request.response.raw, action.from)
        atom.model[action.fn](action.to, value)
      })
    }
  }

}
