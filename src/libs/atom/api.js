import _ from 'lodash'
import { atom, getDefinition, initDefinition } from './common'
import cache from './api-cache'
import flags from './api-flags'
import model from './api-model'
import online from './api-online'
import handlers from './api-handlers'

// handler

const handleRequests = () => {
  if (atom.model.get('api.online')) {
    _.each(model.getRequests(), handleRequest)
  }
}

const handleRequest = (request) => {
  if (!model.getProp(request, 'sent')) {
    model.setProp(request, 'sent', true)
    flags.set(request, 'sending', true)
    if (cache.exists(request)) {
      handleResponse(cache.get(request))
    } else {
      sendRequest(request)
    }
  }
}

// request

const parseRequest = (definition, name, body, query, headers) => {
  return {
    name,
    id: _.uniqueId('api'),
    flags: definition.flags || {},
    handlers: definition.handlers || {},
    request: {
      body: _.defaults({}, body, definition.body),
      query: _.defaults({}, query, definition.query),
      headers: _.defaults({}, headers, definition.headers),
      method: (definition.method || 'get').toUpperCase(),
      path: (definition.path || '') + _.object2query(query)
    },
    response: {
      fromCache: false
    }
  }
}

const sendRequest = (request) => {
  fetch(request.request.path, getRequestOptions(request))
    .then((response) => getResponseData(request, response))
    .then(() => handleResponse(request))
}

const getRequestOptions = (request) => {
  const options = {
    headers: request.request.headers,
    method: request.request.method
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
  _.consoleGroup('api', 'On response: ' + request.request.method + request.request.path + ' (' + request.response.status + ')', 'Request:', request)
  request.response.isValid = handlers.isValid(request)
  handlers.parser(request)
  handlers.mapper(request)
  model.setProp(request, 'response', request.response)
  flags.set(request, 'sending', false)
  _.consoleGroupEnd()
}

export default {

  init: () => {
    cache.init()
    model.init(handleRequests)
    online.init(handleRequests)
  },

  create: (items) => {
    initDefinition(items, (name, definition) => {
      _.set(atom.api, name, definition)
      _.consoleLog('api', 'Created api: ' + name, 'Definition:', definition)
    })
  },

  addEndpoint: (name, body = {}, query = {}, headers = {}) => {
    const definition = getDefinition('api', name)
    const request = parseRequest(definition, name, body, query, headers)
    _.consoleGroup('api', 'Init request: ' + request.name + ' ' + request.request.method + request.request.path, 'Request:', request)
    model.setRequest(request)
    _.consoleGroupEnd()
  }

}
