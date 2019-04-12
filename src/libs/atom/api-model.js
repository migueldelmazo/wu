import _ from 'lodash'
import { atom } from './common'

export default {

  // init

  init: () => {
    atom._private.api.requests = {}
  },

  // requests props

  getProp: (request, prop) => {
    return _.get(atom._private.api.requests, request.id + '.' + prop)
  },

  setProp: (request, prop, value) => {
    _.set(atom._private.api.requests, request.id + '.' + prop, value)
  },

  // requests

  getRequests: () => {
    return atom._private.api.requests
  },

  setRequest: (request) => {
    _.set(atom._private.api.requests, request.id, request)
  },
  
  // model
  
  set: (request) => {
    const destination = _.get(request.handlers, request.response.handler + '.destination')
    _.each(destination, (from, to) => {
      const value = _.get(request.response.parsed, from)
      atom.model.set(to, value)
    })
  }

}
