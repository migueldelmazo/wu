import atom from '../../libs/atom'

export default {

  user: {
    login: {
      path: '/data1.json',
      method: 'get',
      flags: {
        sending: 'user.login.sending'
      },
      on: {
        code200: (response) => {
          console.log(response)
          atom.model.set('user.id', response.response.body.userId)
        }
      }
    }
  }

}
