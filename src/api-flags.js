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
      errorMessage: '',
      sending: true,
      success: false,
      status: ''
    })
  },

  setResponseFlags: (request) => {
    set(request, {
      complete: true,
      error: request.response.raw.error,
      errorMessage: request.response.raw.errorMessage,
      sending: false,
      success: !request.response.raw.error,
      status: request.response.raw.status
    })
  }

}
