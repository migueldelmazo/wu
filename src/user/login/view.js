import atom from '../../libs/atom'

export default {

  user: {
    sendLogin: {
      fn: (body, query) => {
        atom.api.addEndpoint('user.login', body, query)
      }
    }
  }

}
