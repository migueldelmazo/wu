import _ from 'lodash'
import { atom } from './common'

export default {

  // init

  init: () => {
    atom._private.api.requests = {}
  },

  // props

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
  }

}
