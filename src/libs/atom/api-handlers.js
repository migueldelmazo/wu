import _ from 'lodash'

export default {

  isValid: (request) => {
    const definition = _.get(request, 'handlers.code' + request.response.status + '.validator')
    return _.isEmpty(definition) ? true : _.validator(request.response.body, definition)
  },

  parser: (request) => {
    const definition = _.get(request, 'handlers.code' + request.response.status + '.parser')
    const dataPaths = _.getObjectPaths(request.response.body)
    _.each(dataPaths, (dataPath) => {
      if (_.has(definition, dataPath.pattern)) {
        const value = _.get(request.response.body, dataPath.path)
        const parser = _.get(definition, dataPath.pattern)
        const result = parser(value)
        _.set(request.response.body, dataPath.path, result)
      }
    })
  },

  mapper: (request) => {
    const definition = _.get(request, 'handlers.code' + request.response.status + '.mapper')
    const result = {}
    _.each(definition, (destination, src) => {
      const value = _.get(request.response.body, src)
      _.set(result, destination, value)
    })
    request.response.body = result
  }

}
