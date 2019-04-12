import _ from 'lodash'
import { atom } from './common'

const isValidResponseToSetInCache = (request) => {
  return request.request.method === 'GET' &&
    request.response.status === 200 &&
    request.response.ok
}

const getCacheKey = (request) => {
  const key = request.request.method + request.request.path +
  JSON.stringify(request.request.body) +
  JSON.stringify(request.request.headers)
  return key.replace(/\./g, '-')
}

export default {

  init: () => {
    atom._private.api.cache = {}
  },

  exists: (request) => {
    return !!_.get(atom._private.api.cache, getCacheKey(request))
  },

  get: (request) => {
    request.response = _.get(atom._private.api.cache, getCacheKey(request))
    request.fromCache = true
    return request
  },

  set: (request) => {
    if (isValidResponseToSetInCache(request)) {
      _.set(atom._private.api.cache, getCacheKey(request), _.cloneDeep(request.response))
    }
  }

}
