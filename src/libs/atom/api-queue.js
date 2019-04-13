import _ from 'lodash'
import { atom } from './common'

export default {

  init: () => {
    atom._private.api.requests = {}
    atom._private.api.queue = []
  },
  
  add: (request) => {
    atom._private.api.queue.push(request)
  },

  getNextRequest: () => {
    const request = _.first(atom._private.api.queue, { sent: false })
    request.sent = true
    return request
  }

}
