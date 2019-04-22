import _ from 'lodash'
import wu from '../libs/wu'

wu.create('router', 'userLogin', {
  urlPattern: '/',
  to: 'user.login.route'
})

wu.create('ensurer', 'userLogin', {
  onChange: {
    paths: 'app.ready'
  },
  args: {
    email: '',
    password: ''
  },
  to: 'user.login.data'
})

wu.create('watcher', 'userLoginNavigate', {
  onChange: {
    paths: ['user.jwt', 'user.login.route']
  },
  args: ['user.jwt', 'user.login.route'],
  run: (userJwt, loginRoute) => {
    if (!_.isEmpty(userJwt) && loginRoute.isValid) {
      _.navigate('/profile/' + userJwt)
    }
  }
})

wu.create('getter', 'userLoginRoute', {
  args: 'user.login.route.isValid'
})

wu.create('getter', 'userLoginSending', {
  args: 'user.login.api.sending'
})

wu.create('setter', 'userLoginSend', {
  run: (email, password) => ({
    email,
    password
  }),
  to: 'user.login.data'
})

wu.create('api', 'userLogin', {
  onChange: {
    paths: 'user.login.data',
    check: {
      'user.login.data.email': _.isEmail,
      'user.login.data.password': [_.negate(_.isEmpty), _.isString]
    }
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
        to: 'user.jwt'
      }
    ]
  },
  flags: {
    sending: 'user.login.api.sending'
  }
})
