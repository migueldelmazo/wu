import _ from 'lodash'
import { atom } from './common'

const getHandlerDefinition = (request, handler) => {
  return _.get(request.handlers, handler)
}

export default {

  runValidator: (request) => {
    const definition = getHandlerDefinition(request, 'onCode' + request.response.raw.status)
    if (request.response.raw.error) {
      request.response.isValid = false
    } else if (_.isEmpty(definition)) {
      request.response.isValid = true
    } else {
      request.response.isValid = _.validator(request.response.raw, definition)
    }
  },

  selectHandler: (request) => {
    request.response.handler = request.response.raw.error || !request.response.isValid
      ? 'onError'
      : 'onCode' + request.response.raw.status
  },

  runMapper: (request) => {
    const definition = _.get(request.handlers, request.response.handler + '.mapper')
    if (_.isEmpty(definition)) {
      request.response.mapped = _.cloneDeep(request.response.raw)
    } else {
      const result = {}
      _.each(definition, (destination, src) => {
        const value = _.get(request.response.raw, src)
        _.set(result, destination, value)
      })
      request.response.mapped = result
    }
  },

  runParser: (request) => {
    const definition = _.get(request.handlers, request.response.handler + '.parser')
    if (_.isEmpty(definition)) {
      request.response.parsed = _.cloneDeep(request.response.mapped)
    } else {
      request.response.parsed = {}
      const dataPaths = _.getObjectPaths(request.response.mapped)
      _.each(dataPaths, (dataPath) => {
        if (_.has(definition, dataPath.pattern)) {
          const value = _.get(request.response.mapped, dataPath.path)
          const parser = _.get(definition, dataPath.pattern)
          const result = parser(value)
          _.set(request.response.parsed, dataPath.path, result)
        }
      })
    }
  },
  
  setInModel: (request) => {
    const destination = _.get(request.handlers, request.response.handler + '.destination')
    _.each(destination, (from, to) => {
      const value = _.get(request.response.parsed, from)
      atom.model.set(to, value)
    })
  }

}
