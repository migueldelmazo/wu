import { atom } from './common'

export default {
  
  set: (request, name, value) => {
    const flag = request.flags[name]
    if (flag) {
      atom.model.set(flag, value)
    }
  }

}
