import _ from 'lodash'
import { atom } from './common'

const isValidResponseToSetInCache = (request) => {
  return request.config.cacheable &&
    request.request.method === 'GET' &&
    request.response.raw.status === 200 &&
    request.response.error === false &&
    request.response.isValid === true
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
      _.set(atom._private.api.cache, getCacheKey(request), _.cloneDeep(request.response.raw))
      request.response.toCache = true
    } else {
      request.response.toCache = false
    }
  }

}
