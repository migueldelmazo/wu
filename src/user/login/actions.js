import atom from '../../libs/atom'

export default {

  user: {
    login: (data) => {
      atom.api.send('user.login', data)
    }
  }
}
