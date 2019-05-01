import _ from 'lodash'
import { wu } from './common'

const isValidResponseToSetInCache = (request) => {
  return request.options.cacheable === true &&
    request.options.fromCache !== true &&
    request.request.method === 'GET' &&
    request.response.raw.status === 200 &&
    request.response.raw.error === false
}

const getCacheKey = (request) => {
  const key = request.request.method +
  request.request.path +
  JSON.stringify(request.request.body) +
  JSON.stringify(request.request.headers) +
  JSON.stringify(request.request.query)
  return key.replace(/\./g, '-')
}

export default {

  init: () => {
    wu._private.api.cache = {}
  },

  exists: (request) => {
    return !!_.get(wu._private.api.cache, getCacheKey(request))
  },

  import: (request) => {
    request.response.raw = _.get(wu._private.api.cache, getCacheKey(request))
    request.options.fromCache = true
  },

  set: (request) => {
    if (isValidResponseToSetInCache(request)) {
      _.set(wu._private.api.cache, getCacheKey(request), _.cloneDeep(request.response.raw))
      request.options.setInCache = true
    } else {
      request.options.setInCache = false
    }
  }

}
