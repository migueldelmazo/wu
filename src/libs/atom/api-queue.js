import _ from 'lodash'
import { atom } from './common'

export default {

  init: () => {
    atom._private.api.queue = []
  },

  add: (request) => {
    request.state = 'added'
    atom._private.api.queue.push(request)
  },

  getNext: () => {
    return _.find(atom._private.api.queue, {
      state: 'added'
    })
  },
  
  start: (request) => {
    request.state = 'sending'
  },
  
  close: (request) => {
    request.state = 'sent'
  }

}
