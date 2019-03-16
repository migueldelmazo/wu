import _ from 'lodash'
import { atom, getDefinition, initDefinition } from './common'

// handler

const handleRequest = () => {
  setTimeout(() => {
    _.each(endpoints, (endpoint) => {
      if (isLoading(endpoint)) {
        setLoading(endpoint, true)
        if (isInCache(endpoint)) {
          handleResponseFromCache(endpoint)
        } else {
          sendRequest(endpoint)
        }
      }
    })
  })
}

// request

const sendRequest = (endpoint) => {
  fetch(endpoint.request.path, getRequestOptions(endpoint))
    .then((response) => getResponseData(endpoint, response))
    .then((response) => handleResponse(endpoint, response))
}

const getRequestOptions = (endpoint) => {
  const options = {
    method: endpoint.request.method,
    headers: endpoint.request.headers
  }
  if (options.method !== 'GET' && options.method === 'HEAD') {
    options.body = endpoint.body
  }
  return options
}

// response

const getResponseData = (endpoint, response) => {
  return response.json()
    .then((body) => {
      return {
        body: body,
        ok: response.ok,
        status: response.status
      }
    })
}

const handleResponse = (endpoint, response) => {
  _.consoleGroup('endpoint', 'On response: ' + endpoint.request.method + endpoint.request.path + ' (' + endpoint.responseStatus + ')', 'Endpoint:', endpoint)
  endpoint.response = response
  setInCache(endpoint)
  runEndpointCallbacks(endpoint)
  removeRequest(endpoint)
  _.consoleGroupEnd()
  endpoint.resolve(endpoint)
}

// callbacks

const runEndpointCallbacks = (endpoint) => {
  const callbacks = endpoint.on || {}
  const callbackName = 'code' + endpoint.response.status
  const callback = callbacks[callbackName]
  if (_.isFunction(callback)) {
    callback(endpoint)
  }
}

// cache

const isInCache = (endpoint) => {
  const endpointKey = getEndpointKey(endpoint)
  return _.cacheExistsItem(atom.api.__cache, endpointKey)
}

const handleResponseFromCache = (endpoint) => {
  const endpointKey = getEndpointKey(endpoint)
  const response = _.cacheGetItem(atom.api.__cache, endpointKey)
  handleResponse(endpoint, response)
}

const setInCache = (endpoint) => {
  if (endpoint.request.method === 'GET') {
    const endpointKey = getEndpointKey(endpoint)
    _.cacheSetItem(atom.api.__cache, endpointKey, endpoint.response)
  }
}

// key

const getEndpointKey = (endpoint) => {
  return endpoint.request.method + endpoint.request.path +
    JSON.stringify(endpoint.request.body) +
    JSON.stringify(endpoint.request.headers) +
    JSON.stringify(endpoint.request.query)
}

// loading

const setLoading = (endpoint, status) => {
  endpoint.loading = !!status
}

const isLoading = (endpoint) => {
  return endpoint.loading
}

// parser

const parseEndpoint = (endpoint, body, query, resolve, reject) => {
  return {
    reject: reject,
    resolve: resolve,
    on: endpoint.on,
    response: {},
    request: {
      body: _.isPlainObject(endpoint.body) ? endpoint.body : {},
      headers: {
        'Content-Type': 'application/json'
      },
      method: (endpoint.method || 'get').toUpperCase(),
      path: endpoint.path || '',
      query: _.isPlainObject(endpoint.query) ? endpoint.query : {},
    }
  }
}

// endpoint list

const endpoints = []

const addRequest = (endpoint) => {
  endpoints.push(endpoint)
}

const removeRequest = (endpoint) => {
  _.remove(endpoints, endpoint)
}

export default {

  create: (items) => {
    initDefinition(items, (name, definition) => {
      _.set(atom.api, name, definition)
      _.consoleLog('endpoint', 'Created endpoint: ' + name, 'Definition:', definition)
    })
  },

  send: (name, body, query) => {
    return new Promise((resolve, reject) => {
      const definition = getDefinition('api', name)
      const endpoint = parseEndpoint(definition, body, query, resolve, reject)
      _.consoleLog('endpoint', 'Sending endpoint: ' + name + ' ' + endpoint.request.method + endpoint.request.path, 'Endpoint:', endpoint)
      addRequest(endpoint)
      handleRequest()
    })
  }

}
