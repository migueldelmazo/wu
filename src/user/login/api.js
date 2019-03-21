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
          return {
            'user.id': response.response.body.userId
          }
        }
      }
    }
  }

}
