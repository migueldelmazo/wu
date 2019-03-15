import atom from '../../libs/atom'

export default {

  user: {
    login: {
      path: '/user/login',
      method: 'post',
      data: (data) => data,
      on: {
        code200: (data) => {
          atom.model.set('user.id', data.response.userId)
        }
      }
    }
  }

}
