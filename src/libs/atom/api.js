import _ from 'lodash'
import { atom, getDefinition } from './common'
import cache from './api-cache'
import flags from './api-flags'
import model from './api-model'
import online from './api-online'
import handlers from './api-handlers'

// handler

const handleRequests = () => {
  setTimeout(() => {
    if (atom.model.get('api.online')) {
      _.each(model.getRequests(), handleRequest)
    }
  }, 0)
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

const parseRequest = (definition, name) => {
  const headers = _.defaults({}, definition.request.headers)
  const body = _.defaults({}, definition.request.body)
  const query = _.defaults({}, definition.request.query)
  return {
    name,
    id: _.uniqueId('api'),
    sent: false,
    flags: definition.flags || {},
    responses: definition.responses || {},
    request: {
      headers,
      body,
      query,
      method: (definition.request.method || 'get').toUpperCase(),
      path: (definition.request.path || '') + _.objectToQuery(query)
    },
    response: {}
  }
}

const sendRequest = (request) => {
  fetch(request.request.path, getRequestOptions(request))
    .then((response) => getResponseData(request, response))
    .then(() => cache.set(request))
    .then(() => handleResponse(request))
}

const getRequestOptions = (request) => {
  //ToDo: add body in POST, PUT, PATCH... endpoints
  const options = {
    headers: request.request.headers,
    method: request.request.method
  }
  return options
}

// response

const getResponseData = (request, response) => {
  const headers = _.clone(response.headers)
  return response.json()
    .then((body) => {
      request.response = {
        body,
        headers,
        ok: response.ok,
        status: response.status
      }
    })
    .catch((body) => {
      request.response = {
        body: {},
        headers,
        ok: false,
        status: 400
      }
    })
}

const handleResponse = (request) => {
  _.consoleGroup('api', 'On response: ' + request.request.method + request.request.path + ' (' + request.response.status + ')', 'Request:', request)
  // request.response.isValid = handlers.isValid(request)
  // handlers.parser(request)
  // handlers.mapper(request)
  model.setProp(request, 'response', request.response)
  flags.set(request, 'sending', false)
  _.consoleGroupEnd()
}

export default {

  init: () => {
    atom._private.api = atom._private.api || {}
    cache.init()
    model.init()
    online.init(handleRequests)
  },
  
  send: (name) => {
    const definition = getDefinition('api', name)
    const request = parseRequest(definition, name)
    _.consoleGroup('api', 'Init request: ' + request.name + ' ' + request.request.method + request.request.path, 'Request:', request)
    model.setRequest(request)
    _.consoleGroupEnd()
    handleRequests()
  }

}
