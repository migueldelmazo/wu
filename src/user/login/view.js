import atom from '../../libs/atom'

export default {

  user: {
    sendLogin: {
      fn: (data) => {
        atom.api.addEndpoint('user.login', data)
      }
    }
  }

}
