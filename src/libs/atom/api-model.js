import _ from 'lodash'
import { atom } from './common'

export default {
  
  set: (request) => {
    const destination = _.get(request.handlers, request.response.handler + '.destination')
    _.each(destination, (from, to) => {
      const value = _.get(request.response.parsed, from)
      atom.model.set(to, value)
    })
  }

}
