import _ from 'lodash'
import { atom, getDefinition, initDefinition } from './common'

// handler

const handleRequests = () => {
  _.each(atom.model.get('_api.requests'), (request) => {
    if (!getModelProp(request, 'sent')) {
      updateModelProp(request, 'sent', true)
      if (isInCache(request)) {
        handleResponseFromCache(request)
      } else {
        sendRequest(request)
      }
    }
  })
}

// request

const getRequest = (endpoint, name, body, query) => {
  return {
    name,
    id: _.uniqueId('req'),
    flags: endpoint.flags || {},
    on: endpoint.on || {},
    response: {},
    request: {
      body: _.isPlainObject(body) ? body : {},
      query: _.isPlainObject(query) ? query : {},
      method: (endpoint.method || 'get').toUpperCase(),
      path: (endpoint.path || '') + _.object2query(query),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
}

const sendRequest = (request) => {
  setFlag(request, 'sending', true)
  fetch(request.request.path, getRequestOptions(request))
    .then((response) => getResponseData(request, response))
    .then(() => setFlag(request, 'sending', false))
    .then(() => handleResponse(request))
}

const getRequestOptions = (request) => {
  const options = _.pick(request, ['headers', 'method'])
  if (options.method !== 'GET' && options.method === 'HEAD') {
    options.body = request.body
  }
  return options
}

// response

const getResponseData = (request, response) => {
  return response.json()
    .then((body) => {
      request.response = {
        body: body,
        ok: response.ok,
        status: response.status
      }
    })
    .catch((body) => {
      request.response = {
        body: {},
        ok: false,
        status: 400
      }
    })
}

const handleResponse = (request) => {
  _.consoleGroup('endpoint', 'On response: ' + request.request.method + request.request.path + ' (' + request.response.status + ')', 'Request:', request)
  setInCache(request)
  runCallbacks(request)
  updateModelProp(request, 'response', request.response)
  _.consoleGroupEnd()
}

// cache

const isInCache = (request) => {
  return !!atom.model.get('_api.cache.' + getCacheKey(request))
}

const setInCache = (request) => {
  if (isValidResponse(request)) {
    atom.model.set('_api.cache.' + getCacheKey(request), request.response, {
      silent: true
    })
  }
}

const handleResponseFromCache = (request) => {
  request.response = atom.model.get('_api.cache.' + getCacheKey(request))
  handleResponse(request)
}

const isValidResponse = (request) => {
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

// callbacks

const runCallbacks = (request) => {
  const callbackName = 'code' + request.response.status
  const callback = request.on[callbackName]
  if (_.isFunction(callback)) {
    _.consoleGroup('endpoint', 'Run endpoint callback: ' + callbackName, 'Request:', request)
    callback(request)
    _.consoleGroupEnd()
  }
}

// flags

const setFlag = (request, name, value) => {
  const flag = request.flags[name]
  if (flag) {
    atom.model.set(flag, value)
  }
}

// model

const getModelProp = (request, prop, defaultValue) => {
  return atom.model.get('_api.requests.' + request.id + '.' + prop, defaultValue)
}

const updateModelProp = (request, prop, value) => {
  return atom.model.set('_api.requests.' + request.id + '.' + prop, value, {
    silent: true
  })
}

const setModel = (request) => {
  return atom.model.set('_api.requests.' + request.id, request)
}

export default {

  create: (items) => {
    initDefinition(items, (name, definition) => {
      _.set(atom.api, name, definition)
      _.consoleLog('endpoint', 'Created endpoint: ' + name, 'Definition:', definition)
    })
  },

  init: () => {
    atom.model.set('_api.cache', {}, {
      silent: true
    })
    atom.model.set('_api.requests', {}, {
      silent: true
    })
    atom.model.watch('_api.requests', handleRequests, {
      type: 'api'
    })
  },

  addEndpoint: (name, body = {}, query = {}) => {
    const definition = getDefinition('api', name)
    const request = getRequest(definition, name, body, query)
    _.consoleGroup('endpoint', 'Send request: ' + request.name + ' ' + request.request.method + request.request.path, 'Request:', request)
    setModel(request)
    _.consoleGroupEnd()
  }

}
