import _ from 'lodash'
import { areValidDeps, getSubState, isValidFn, parseDepsToPaths } from './wuHelpers'
import { logError, logFetchEnd, logFetchRequests, logFetchStart } from './wuLog'
import { listen, set } from './wuState'

export const wuFetch = (fn, deps = []) => {
  // check arguments
  if (!isValidFn(fn)) {
    logError('wuFetch: first argument "fn" must be a function.', fn)
  } else if (!areValidDeps(deps)) {
    logError(
      'wuFetch: second argument "deps" must be an array of dependencies (string or wuGet function).',
      deps
    )
  } else {
    // create wrapper function
    const fetcher = (...args) => {
      const depsValues = getSubState(deps)
      const req = fn(...depsValues, ...args)
      addRequest(req, 'wuFetch')
    }
    fetcher.wuType = 'wuFetch'
    return fetcher
  }
}

export const wuReactiveFetch = (fn, deps = []) => {
  // check arguments
  if (!isValidFn(fn)) {
    logError('wuReactiveFetch: first argument "fn" must be a function.', fn)
  } else if (!areValidDeps(deps)) {
    logError(
      'wuReactiveFetch: second argument "deps" must be an array of dependencies (string or wuGet function).',
      deps
    )
  } else {
    // create wrapper function
    const fetcher = () => {
      const depsValues = getSubState(deps)
      const req = fn(...depsValues)
      addRequest(req, 'wuReactiveFetch')
    }
    fetcher.wuDeps = parseDepsToPaths(deps)
    fetcher.wuType = 'wuReactiveFetch'
    // listen wrapper function
    listen(fetcher)
  }
}

// private methods

const requests = []
let manageRequestsTimer
let logManageRequestsTimer

const addRequest = (newRequests, wuType) => {
  if (newRequests) {
    newRequests = _.isArray(newRequests) ? newRequests : [newRequests]
    newRequests.forEach(newRequest => requests.push(parseRequest(newRequest, wuType)))
    clearTimeout(manageRequestsTimer)
    manageRequestsTimer = setTimeout(manageRequests)
  }
}

const parseRequest = (req = {}, wuType) => {
  return {
    request: {
      url: req.url || '',
      method: (req.method || 'get').toUpperCase(),
      headers: {},
      body: req.body || {},
      status: 'null'
    },
    response: {
      data: null,
      error: null,
      errorMessage: '',
      raw: null,
      statusCode: 0
    },
    statusPath: req.statusPath,
    onInit: req.onInit,
    onComplete: req.onComplete,
    onError: req.onError,
    onSuccess: req.onSuccess,
    wuType
  }
}

const manageRequests = () => {
  requests.forEach(req => {
    if (req.request.status === 'null') {
      manageRequest(req)
    }
  })
}

const manageRequest = req => {
  logFetchStart(`${req.wuType} request`, req)
  // run callback
  const callbacksSubState = {}
  runCallbacks(callbacksSubState, req, 'onInit', {})
  set(callbacksSubState, `${req.wuType} onInit`)
  // set request status
  req.request.status = 'loading'
  // set status in Wu
  setStatus(req)
  // send request
  fetch(req.request.url, {
    method: req.request.method,
    body: req.request.method !== 'GET' ? req.request.body : undefined,
    headers: req.request.headers
  })
    .then(response => (req.response.raw = response))
    .then(() => req.response.raw.json())
    .then(data => (req.response.data = data))
    .catch(err => (req.response.error = err))
    .then(() => (req.response.errorMessage = req.response.error?.message || ''))
    .then(() => (req.response.statusCode = req.response.raw?.status))
    .then(() => manageResponse(req))
  logFetchEnd()
}

const manageResponse = req => {
  logFetchStart(`${req.wuType} response`, req)
  // run callbacks
  const callbacksSubState = {}
  runCallbacks(callbacksSubState, req, 'onSuccess', req.response.data)
  runCallbacks(callbacksSubState, req, 'onError', req.response.error)
  runCallbacks(callbacksSubState, req, `onComplete`, req.response.data)
  // set callbacks result and request status in state
  set(callbacksSubState, `${req.wuType} data`)
  // set request status
  req.request.status = 'completed'
  // set status in Wu
  setStatus(req)
  logFetchEnd()
  logRequests()
}

const setStatus = req => {
  if (req.statusPath) {
    const status = {
      isLoading: req.request.status === 'loading',
      isError: !!req.response.error,
      isSuccess: !!req.response.data,
      errorMessage: req.response.errorMessage,
      statusCode: req.response.statusCode
    }
    set({ [req.statusPath]: status }, 'wuFetch status')
  }
}

const runCallbacks = (subState, req, callbackName, data) => {
  const fn = req[callbackName]
  if (_.isFunction(fn) && data) {
    const result = fn(_.cloneDeep(data), _.cloneDeep(req))
    _.assign(subState, result)
  }
}

const logRequests = () => {
  clearTimeout(logManageRequestsTimer)
  logManageRequestsTimer = setTimeout(() => logFetchRequests(requests))
}

// const requestData = {
//   cache: {
//     // política de caché
//     query: '',
//     time: 60 * 1000
//   },
//   focus: {
//     // política de repetir la petición en caso de recuperar el foco
//   },
//   online: {
//     // política de repetir la petición en caso de recuperar la conexión a Internet
//   },
//   retry: {
//     // política de reintentos en caso de error
//     times: 5,
//     delay: 5000
//   },
// }
