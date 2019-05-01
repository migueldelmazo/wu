import _ from 'lodash'
import { wu } from './common'

const set = (request, flags) => {
  _.each(flags, (value, flag) => {
    flag = request.options.flags[flag]
    if (flag) {
      wu.model.set(flag, value)
    }
  })
}

export default {

  setRequestFlags: (request) => {
    set(request, {
      complete: false,
      error: false,
      ok: false,
      sending: true,
      status: ''
    })
  },

  setResponseFlags: (request) => {
    set(request, {
      complete: true,
      error: request.response.raw.error,
      ok: !request.response.raw.error,
      sending: false,
      status: request.response.raw.status
    })
  }

}
