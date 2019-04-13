import _ from 'lodash'
import { atom } from './common'

const isValidResponseToSetInCache = (request) => {
  return request.config.cacheable === true &&
    request.config.fromCache !== true &&
    request.request.method === 'GET' &&
    request.response.raw.status === 200 &&
    request.response.raw.error === false &&
    request.response.isValid === true
}

const getCacheKey = (request) => {
  const key = request.request.method +
    request.request.path +
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

  import: (request) => {
    request.response.raw = _.get(atom._private.api.cache, getCacheKey(request))
    request.config.fromCache = true
  },

  set: (request) => {
    if (isValidResponseToSetInCache(request)) {
      _.set(atom._private.api.cache, getCacheKey(request), _.cloneDeep(request.response.raw))
      request.config.setInCache = true
    } else {
      request.config.setInCache = false
    }
  }

}
