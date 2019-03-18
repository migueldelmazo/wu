import atom from '../../libs/atom'

export default {

  user: {
    login: {
      path: '/data.json',
      method: 'get',
      flags: {
        sending: 'user.login.sending'
      },
      on: {
        code200: (response) => {
          console.log(response)
          atom.model.set('user.id', response.response.body.userId)
          // ToDo: return an object { modelPath: value }
        }
      }
    }
  }

}
