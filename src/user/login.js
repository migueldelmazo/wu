import _ from 'lodash'
import wu from '../libs/wu'

wu.create('router', 'userLogin', {
  urlPattern: '/',
  update: 'user.login.route'
})

wu.create('ensurer', 'userLogin', {
  onChange: 'app.ready',
  args: {
    email: '',
    password: ''
  },
  update: 'user.login.data'
})

wu.create('watcher', 'userLoginNavigate', {
  onChange: ['user.jwt', 'user.login.route'],
  args: ['user.jwt', 'user.login.route'],
  run: (userJwt, loginRoute) => {
    if (!_.isEmpty(userJwt) && loginRoute.isActive) {
      _.navigate('/profile/' + userJwt)
    }
  }
})

wu.create('getter', 'userLoginRoute', {
  args: 'user.login.route.isActive'
})

wu.create('getter', 'userLoginSending', {
  args: 'user.login.api.sending'
})

wu.create('setter', 'userLoginSend', {
  run: (email, password) => ({
    email,
    password
  }),
  update: 'user.login.data'
})

wu.create('api', 'userLogin', {
  onChange: 'user.login.data',
  when: {
    'user.login.data.email': _.isEmail,
    'user.login.data.password': [_.negate(_.isEmpty), _.isString]
  },
  request: {
    method: 'get',
    path: '/login.json',
    query: {
      args: {
        email: 'user.login.data.email',
        password: 'user.login.data.password'
      }
    }
  },
  handlers: {
    onCode200: [
      {
        run: (response) => response.body.jsonWebToken,
        update: 'user.jwt'
      }
    ]
  },
  options: {
    flags: {
      complete: 'user.login.api.complete',
      error: 'user.login.api.error',
      ok: 'user.login.api.ok',
      sending: 'user.login.api.sending'
    }
  }
})
