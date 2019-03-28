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
    atom.model.set('_api.cache', {}, {
      silent: true
    })
  },
  
  exists: (request) => {
    return !!atom.model.get('_api.cache.' + getCacheKey(request))
  },

  get: (request) => {
    request.response = atom.model.get('_api.cache.' + getCacheKey(request))
    request.fromCache = true
    return request
  },

  set: (request) => {
    if (!request.fromCache && isValidResponseToSetInCache(request)) {
      atom.model.set('_api.cache.' + getCacheKey(request), request.response, {
        silent: true
      })
    }
  }

}
