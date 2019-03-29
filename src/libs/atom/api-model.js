import { atom } from './common'

export default {

  // init

  init: (requestsHandler) => {
    atom.model.set('_api.requests', {}, {
      silent: true
    })
    atom.model.watch('_api.requests', requestsHandler, {
      type: 'api'
    })
  },

  // props

  getProp: (request, prop, defaultValue) => {
    return atom.model.get('_api.requests.' + request.id + '.' + prop, defaultValue)
  },

  setProp: (request, prop, value) => {
    return atom.model.set('_api.requests.' + request.id + '.' + prop, value, {
      silent: true
    })
  },

  // requests

  getRequests: () => {
    return atom.model.get('_api.requests')
  },

  setRequest: (request) => {
    return atom.model.set('_api.requests.' + request.id, request)
  }

}
