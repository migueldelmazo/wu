import _ from 'lodash'

_.mixin({

  queryParams2object: (queryParams) => {
    const queryPosition = queryParams.indexOf('?')
    if (queryPosition >= 0) {
      const hashPosition = queryParams.indexOf('#')
      queryParams = queryParams.substr(0, hashPosition)
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

  getUrlParams: (url, expresion) => {
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

  matchUrlParams: (url, expresion) => {
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
  }

})
