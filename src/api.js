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
  _.each(contextItems, (context) => {
    const request = parseRequest(name, definition, context)
    queue.add(request)
  })
  handleRequests()
}

const getDefinitionContext = (definition) => {
  const context = _.has(definition, 'options.context') ? runFn(definition.options.context) : undefined
  return _.isArray(context) ? context : [context]
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
      flags: _.get(definition, 'options.flags', {}),
      handler: _.get(definition, 'options.handler', {})
    },
    onResponse: _.get(definition, 'onResponse', {}),
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

const getRequestData = (request, key, defaultValue, context) => {
  const definition = _.get(request, 'request.' + key)
  const data = runFn(definition, context)
  if (data === undefined) {
    return defaultValue
  } else if (_.isPlainObject(data) || _.isArray(data)) {
    return wu.model.populate(data)
  } else {
    return data
  }
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
  _.logStart('api', 'API: send ' + request.name, 'Path:', request.request.path, 'Request:', request)
  queue.start(request)
  flags.setRequestFlags(request)
  if (cache.exists(request)) {
    cache.import(request)
    cache.setFromCache(request, true)
    handleResponse(request)
  } else {
    cache.setFromCache(request, false)
    fetch(getFetchPath(request), getFetchOptions(request))
      .then((response) => setRawResponse(request, response))
      .then(() => handleResponse(request))
  }
  _.logEnd()
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
          headers: _.clone(response.headers || {}),
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
          headers: _.clone(response.headers || {}),
          status: response.status || 500
        }
      }
    })
}

const handleResponse = (request) => {
  _.logStart('api', 'API: response ' + request.name + ' with status ' + request.response.raw.status, 'Path:', request.request.path, 'Request:', request)
  handlers.runHandlers(request)
  flags.setResponseFlags(request)
  cache.set(request)
  queue.close(request)
  _.logEnd()
}

export default {

  setDefinition: (name, definition) => {
    setDefinition('api', name, definition, {
      onChange: true,
      onResponse: true,
      options: false,
      request: true,
      when: false
    })
  },

  watch: (name) => {
    const definition = getDefinition('api', name)
    if (definition) {
      wu.model.watch(definition.onChange, add.bind(null, name), definition.when)
    }
  },

  start: () => {
    wu._private.api = wu._private.api || {}
    cache.init()
    queue.init()
    online.init(handleRequests)
  }

}
