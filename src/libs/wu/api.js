import _ from 'lodash'
import { wu, runFn } from './common'
import { getDefinition, setDefinition } from './definition'
import cache from './api-cache'
import flags from './api-flags'
import handlers from './api-handlers'
import online from './api-online'
import queue from './api-queue'

// send

const add = (name) => {
  const definition = getDefinition('api', name)
  const contextItems = getDefinitionContext(definition)
  _.each(contextItems, (contextItem) => {
    const request = parseRequest(name, definition, contextItem)
    queue.add(request)
  })
  handleRequests()
}

const getDefinitionContext = (definition) => {
  return _.has(definition, 'options.context') ? runFn(definition.options.context) : [undefined]
}

const parseRequest = (name, definition, context) => {
  const body = getRequestData(definition, 'body', {}, context)
  const headers = getRequestData(definition, 'headers', {}, context)
  const method = getRequestData(definition, 'method', 'get', context).toUpperCase()
  const path = getRequestData(definition, 'path', '', context)
  const query = getRequestData(definition, 'query', {}, context)
  return {
    name,
    options: {
      context,
      cacheable: _.get(definition, 'options.cacheable', true),
      flags: _.get(definition, 'options.flags', {})
    },
    handlers: _.get(definition, 'handlers', {}),
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

const getRequestData = (definition, key, defaultValue, context) => {
  const data = _.get(definition, 'request.' + key)
  return data ? runFn(data, context) : defaultValue
}

// handler requests

const handleRequests = () => {
  setTimeout(() => {
    if (wu.model.get('api.online')) {
      const nextRequest = queue.getNext()
      if (!_.isEmpty(nextRequest)) {
        handleRequest(nextRequest)
        handleRequests()
      }
    }
  })
}

const handleRequest = (request) => {
  _.consoleGroup('api', 'API: send ' + request.name, 'Path:', request.request.path, 'Request:', request)
  queue.start(request)
  flags.setRequestFlags(request)
  if (cache.exists(request)) {
    cache.import(request)
    handleResponse(request)
  } else {
    fetch(getFetchPath(request), getFetchOptions(request))
      .then((response) => setRawResponse(request, response))
      .then(() => handleResponse(request))
  }
  _.consoleGroupEnd()
}

const getFetchPath = (request) => {
  return request.request.path + _.objectToQuery(request.request.query)
}

const getFetchOptions = (request) => {
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
  handlers.setHandler(request)
  _.consoleGroup('api', 'API: response ' + request.name + ' with status ' + request.response.raw.status, 'Path:', request.request.path, 'Request:', request)
  handlers.runHandler(request, request.response.handler)
  handlers.runHandler(request, 'onComplete')
  flags.setResponseFlags(request)
  cache.set(request)
  queue.close(request)
  _.consoleGroupEnd()
}

export default {

  setDefinition: (name, definition) => {
    setDefinition('api', name, definition, {
      handlers: true,
      onChange: true,
      options: false,
      request: true,
      when: false
    })
  },

  watch: (name) => {
    const definition = getDefinition('api', name)
    wu.model.watch(definition.onChange, add.bind(null, name), definition.when)
  },

  start: () => {
    wu._private.api = wu._private.api || {}
    cache.init()
    queue.init()
    online.init(handleRequests)
  }

}
