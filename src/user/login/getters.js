import atom from '../../libs/atom'

export default {

  user: {
    isLogged: {
      args: 'user.isLogged',
      fn: (isLogged) => isLogged
    },

    sendLogin: {
      fn: (data) => {
        atom.api.addEnpoint('user.login', {}, data)
      }
    }
  }

}
