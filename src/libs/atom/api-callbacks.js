import _ from 'lodash'
import { atom } from './common'

export default {
  
  run: (request) => {
    const callbackName = 'code' + request.response.status
    const callback = request.on[callbackName]
    if (_.isFunction(callback)) {
      _.consoleGroup('endpoint', 'Run api callback: ' + callbackName, 'Request:', request)
      _.each(callback(request), (value, path) => atom.model.set(path, value))
      _.consoleGroupEnd()
    }
  }

}
