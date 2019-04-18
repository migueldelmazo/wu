import _ from 'lodash'
import { wu, getDefinition, runFn } from './common'
import cache from './api-cache'
import flags from './api-flags'
import handlers from './api-handlers'
import online from './api-online'
import queue from './api-queue'

// send

const send = (name) => {
  const request = parseRequest(name)
  _.consoleGroup('api', 'API: added ' + request.name, 'Request:', request)
  queue.add(request)
  _.consoleGroupEnd()
  handleRequests()
}

const parseRequest = (name) => {
  const definition = getDefinition('api', name)
  const query = getRequestData(definition, 'query')
  const body = getRequestData(definition, 'body')
  const headers = getRequestData(definition, 'headers')
  const method = _.result(definition, 'request.method', 'get').toUpperCase()
  const path = _.result(definition, 'request.path', '') + _.objectToQuery(query)
  return {
    name,
    config: {
      cacheable: _.get(definition, 'config.cacheable', true)
    },
    flags: definition.flags || {},
    handlers: definition.handlers || {},
    request: {
      body,
      headers,
      method,
      path,
      query
    },
    response: {}
  }
}

const getRequestData = (definition, key) => {
  const data = _.get(definition, 'request.' + key)
  return data ? runFn(data) : {}
}

// handler requests

const handleRequests = () => {
  setTimeout(() => {
    if (wu.model.get('app.online')) {
      const nextRequest = queue.getNext()
      if (!_.isEmpty(nextRequest)) {
        handleRequest(nextRequest)
      }
    }
    handleRequests()
  })
}

const handleRequest = (request) => {
  _.consoleGroup('api', 'API: send ' + request.name, 'Request:', request)
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
  _.consoleGroupEnd()
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
  _.consoleGroup('api', 'API: response ' + request.name + ' with status ' + request.response.raw.status, 'Request:', request)
  handlers.runActions(request)
  flags.set(request, 'sending', false)
  cache.set(request)
  queue.close(request)
  _.consoleGroupEnd()
}

export default {

  start: () => {
    wu._private.api = wu._private.api || {}
    cache.init()
    queue.init()
    online.init(handleRequests)
  },

  watch: (name) => {
    const definition = getDefinition('api', name)
    wu.model.watch(definition.onChange.paths, definition.onChange.check, send.bind(null, name))
  }

}
