import _ from 'lodash'
import { atom } from './common'

const ensureModel = () => {
  let online = _.get(window, 'navigator.onLine')
  online = online === undefined ? true : online
  atom.model.set('app.online', online)
}

export default {

  init: (requestsHandler) => {
    window.addEventListener('online', ensureModel)
    window.addEventListener('offline', ensureModel)
    atom.model.watch('app.online', undefined, requestsHandler)
    ensureModel()
  }

}
