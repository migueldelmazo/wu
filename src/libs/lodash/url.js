import _ from 'lodash'

// router helpers

const listenPopStateEvent = (callback) => {
  window.addEventListener('popstate', () => callback)
}

const listenPushStateEvent = (callback) => {
  window.addEventListener('click', (ev) => {
    if (isAnchorDomElementWithHref(ev)) {
      ev.stopPropagation()
      ev.preventDefault()
      replaceWindowLocation(ev.srcElement.href)
      callback()
    }
  })
}

const isAnchorDomElementWithHref = (ev) => {
  return ev.srcElement.tagName === 'A' && _.isString(ev.srcElement.href)
}

const replaceWindowLocation = (url) => {
  window.history.pushState({}, '', url)
}

_.mixin({

  /**
   * Init router: run callback on window location changes and on click anchors
   * @param {function} Callback to run
   */
  initRouter: (callback) => {
    listenPopStateEvent(callback)
    listenPushStateEvent(callback)
  },

  /**
   * Returns an object with window.location data
   * @returns {object} Object like { url, pachName, hash, queryParams }
   */
  getWindowLocationData: () => {
    return {
      url: window.location.href,
      pathName: window.location.pathname,
      hash: window.location.hash.substr(1),
      queryParams: _.queryParamsToObject(window.location.href)
    }
  },

  /**
   * @returns {boolean} Returns an object with route params
   * @param {string} Url
   * @param {string} Expresion like /user/:userId
   * @example _.matchRouteParams('/user/123', '/user/:userId') // { userId: 123 }
   */
  getRouteParams: (url, expresion) => {
    url = url.split('/')
    expresion = expresion.split('/')
    const params = {}
    if (url.length !== expresion.length) {
      return {}
    }
    for (let idx = 1; idx < url.length; idx += 1) {
      if (expresion[idx].indexOf(':') === 0) {
        params[expresion[idx].substr(1)] = url[idx]
      } else if (expresion[idx] !== url[idx]) {
        return {}
      }
    }
    return params
  },

  /**
   * @returns {boolean} Returns true if url and expresion match
   * @param {string} Url
   * @param {string} Expresion like /user/:userId
   * @example _.matchRouteParams('/user/login', '/user/login') // true
   * @example _.matchRouteParams('/user/123', '/user/:userId') // true
   */
  matchRouteParams: (url, expresion) => {
    url = url.split('/')
    expresion = expresion.split('/')
    if (url.length !== expresion.length) {
      return false
    }
    for (let idx = 1; idx < url.length; idx += 1) {
      if (expresion[idx] !== url[idx] && expresion[idx].indexOf(':') !== 0) {
        return false
      }
    }
    return true
  },

  /**
   * @returns {object} Returns an object with query params
   * @param {string} Query params string
   * @example _.queryParamsToObject('home?user=123') // { user: 123 }
   */
  queryParamsToObject: (queryParams) => {
    const queryPosition = queryParams.indexOf('?')
    if (queryPosition >= 0) {
      const hashPosition = queryParams.indexOf('#')
      queryParams = hashPosition > 0 ? queryParams.substr(0, hashPosition) : queryParams
      queryParams = queryParams.substr(queryPosition + 1)
      queryParams = queryParams.charAt(0) === '&' ? queryParams.substr(1) : queryParams
      return _.reduce(queryParams.split('&'), (result, queryParam) => {
        queryParam = queryParam.split('=')
        result[queryParam[0]] = queryParam[1]
        return result
      }, {})
    }
    return {}
  },

  /**
   * @returns {string} Returns a string with query params
   * @param {object} Query params object
   * @example _.queryParamsToObject({ user: 123 }) // '?user=123'
   */
  objectToQuery: (obj) => {
    const queryParams = _.map(obj, (value, key) => key + '=' + value)
    return _.isEmpty(queryParams) ? '' : '?' + queryParams.join('&')
  }

})
