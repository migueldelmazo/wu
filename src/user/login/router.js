import atom from '../../libs/atom'

export default {

  user: {
    login: {
      urlPathName: '/user/:login',
      destination: 'user.login.route',
      fn: () => {
        atom.api.addEndpoint('user.login')
      }
    }
  }

}
