import { wu } from './common'

export default {

  set: (request, name, value) => {
    const flag = request.flags[name]
    if (flag) {
      wu.model.set(flag, value)
    }
  }

}
