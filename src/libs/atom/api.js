import _ from 'lodash'
import { atom, getDefinition } from './common'
import cache from './api-cache'
import flags from './api-flags'
import handlers from './api-handlers'
import online from './api-online'
import queue from './api-queue'

// parse

const parseRequest = (name) => {
  const definition = getDefinition('api', name)
  const body = _.get(definition, 'request.body', {})
  const headers = _.get(definition, 'request.headers', {})
  const query = _.get(definition, 'request.query', {})
  const method = _.get(definition, 'request.method', 'get').toUpperCase()
  const path = _.get(definition, 'request.path', '') + _.objectToQuery(query)
  return {
    name,
    config: {
      cacheable: _.get(definition, 'config.cacheable', true)
    },
    flags: definition.flags || {},
    handlers: definition.handlers || {},
    request: { body, headers, query, method, path },
    response: {}
  }
}

// handler requests

const handleRequests = () => {
  setTimeout(() => {
    if (atom.model.get('api.online')) {
      const nextRequest = queue.getNext()
      if (!_.isEmpty(nextRequest)) {
        handleRequest(nextRequest)
      }
    }
    handleRequests()
  })
}

const handleRequest = (request) => {
  queue.start(request)
  flags.set(request, 'sending', true)
  if (cache.exists(request)) {
    cache.import(request)
    handleResponse(request)
  } else {
    fetch(request.request.path, getRequestOptions(request))
      .then((response) => setRawResponse(request, response))
      .then(() => handleResponse(request))
  }
}

const getRequestOptions = (request) => {
  const options = {
    headers: request.request.headers,
    method: request.request.method
  }
  if (['PATCH', 'POST', 'PATCH'].indexOf(options.method) >= 0) {
    options.body = JSON.stringify(request.request.body)
  }
  return options
}

// response

const setRawResponse = (request, response) => {
  return response.json()
    .then((body) => {
      request.response = {
        raw: {
          body: body,
          error: false,
          errorMessage: '',
          headers: _.clone(response.headers),
          status: response.status
        }
      }
    })
    .catch((err) => {
      request.response = {
        raw: {
          body: {},
          error: true,
          errorMessage: err.message,
          headers: {},
          status: 500
        }
      }
    })
}

const handleResponse = (request) => {
  _.consoleGroup('api', 'On response: ' + request.request.method + request.request.path + ' (status: ' + request.response.raw.status + ')', 'Request:', request)
  handlers.runValidator(request)
  handlers.selectHandler(request)
  handlers.runMapper(request)
  handlers.runParser(request)
  handlers.setInModel(request)
  flags.set(request, 'sending', false)
  cache.set(request)
  queue.close(request)
  _.consoleGroupEnd()
}

export default {

  init: () => {
    atom._private.api = atom._private.api || {}
    cache.init()
    queue.init()
    online.init(handleRequests)
  },

  send: (name) => {
    const request = parseRequest(name)
    _.consoleGroup('api', 'Added request to API queue: ' + request.name + ' ' + request.request.method + request.request.path, 'Request:', request)
    queue.add(request)
    _.consoleGroupEnd()
    handleRequests()
  }

}
