import _ from 'lodash'
import { atom, getDefinition, initDefinition } from './common'
import cache from './api-cache'
import callbacks from './api-callbacks'
import flags from './api-flags'
import model from './api-model'

// handler

const handleRequests = () => {
  _.each(model.getRequests(), (request) => {
    if (!model.getProp(request, 'sent')) {
      model.updateProp(request, 'sent', true)
      if (cache.exists(request)) {
        handleResponse(cache.get(request))
      } else {
        sendRequest(request)
      }
    }
  })
}

// request

const parseRequest = (endpoint, name, body, query) => {
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
  flags.set(request, 'sending', true)
  fetch(request.request.path, getRequestOptions(request))
    .then((response) => getResponseData(request, response))
    .then(() => handleResponse(request))
    .then(() => flags.set(request, 'sending', false))
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
  cache.set(request)
  callbacks.run(request)
  model.updateProp(request, 'response', request.response)
  _.consoleGroupEnd()
}

export default {

  init: () => {
    cache.init()
    model.init(handleRequests)
  },

  create: (items) => {
    initDefinition(items, (name, definition) => {
      _.set(atom.api, name, definition)
      _.consoleLog('endpoint', 'Created endpoint: ' + name, 'Definition:', definition)
    })
  },

  addEndpoint: (name, body = {}, query = {}) => {
    const definition = getDefinition('api', name)
    const request = parseRequest(definition, name, body, query)
    _.consoleGroup('endpoint', 'Send request: ' + request.name + ' ' + request.request.method + request.request.path, 'Request:', request)
    model.setRequest(request)
    _.consoleGroupEnd()
  }

}
