import _ from 'lodash'
import { wu } from './common'

const ensureModel = () => {
  let online = _.get(window, 'navigator.onLine')
  online = online === undefined ? true : online
  wu.model.set('api.online', online)
}

export default {

  init: (requestsHandler) => {
    window.addEventListener('online', ensureModel)
    window.addEventListener('offline', ensureModel)
    wu.model.watch('api.online', requestsHandler)
    ensureModel()
  }

}
