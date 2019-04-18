import _ from 'lodash'
import { wu } from './common'

export default {

  init: () => {
    wu._private.api.queue = []
  },

  add: (request) => {
    request.state = 'added'
    wu._private.api.queue.push(request)
  },

  getNext: () => {
    return _.find(wu._private.api.queue, {
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
