import _ from 'lodash'

export default {

  user: {
    isLogged: {
      listeners: 'user.id',
      args: 'user.id',
      fn: (id) => !_.isEmpty(id),
      destination: 'user.isLogged'
    }
  }
}
