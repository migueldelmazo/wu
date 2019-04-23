import _ from 'lodash'
import { wu } from './common'

export default {

  set: (request, flags) => {
    _.each(flags, (value, flag) => {
      flag = request.options.flags[flag]
      if (flag) {
        wu.model.set(flag, value)
      }
    })
  }

}
