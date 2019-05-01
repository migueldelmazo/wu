import _ from 'lodash'
import { wu } from './common'

const ensureApiLoading = () => {
  setTimeout(() => {
    const isLoading = _.some(wu._private.api.queue, {
      state: 'sending'
    })
    wu.model.set('api.loading', isLoading)
  }, 100)
}

export default {

  init: () => {
    wu._private.api.queue = []
  },

  add: (request) => {
    const itemFound = _.find(wu._private.api.queue, (item) => {
      return item.name === request.name &&
        _.isEqual(item.request, request.request) &&
        (item.state === 'added' || item.state === 'sending')
    })
    if (!itemFound) {
      request.state = 'added'
      wu._private.api.queue.push(request)
      _.consoleLog('api', 'API: added ' + request.name, 'Path:', request.request.path, 'Request:', request)
    }
  },

  getNext: () => {
    return _.find(wu._private.api.queue, {
      state: 'added'
    })
  },

  start: (request) => {
    request.state = 'sending'
    ensureApiLoading()
  },

  close: (request) => {
    request.state = 'sent'
    ensureApiLoading()
  }

}
