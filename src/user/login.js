import _ from 'lodash'
import atom from '../libs/atom'

atom.create('router', 'userLogin', {
  urlPathName: '/login',
  destination: 'user.login.route'
})

atom.create('ensure', 'userLogin', {
  watcher: 'app.ready',
  fn: () => ({
    email: '',
    password: ''
  }),
  destination: 'user.login.data'
})

atom.create('watcher', 'userLoginNavigate', {
  watcher: ['user.jwt', 'user.login.route'],
  args: ['user.jwt', 'user.login.route'],
  fn: (userJwt, loginRoute) => {
    if (_.isNotEmpty(userJwt) && loginRoute.isValid) {
      _.navigate('/profile/' + userJwt)
    }
  }
})

atom.create('getter', 'userLoginRoute', {
  args: 'user.login.route.isValid'
})

atom.create('getter', 'userLoginSending', {
  args: 'user.login.api.sending'
})

atom.create('setter', 'userLoginSend', {
  fn: (email, password) => ({
    email,
    password
  }),
  destination: 'user.login.data'
})

atom.create('api', 'userLogin', {
  watcher: {
    paths: 'user.login.data',
    validator: {
      'user.login.data.email': [_.negate(_.isEmpty), _.isString],
      'user.login.data.password': [_.negate(_.isEmpty), _.isString]
    }
  },
  request: {
    method: 'get',
    path: '/login.json',
    query: {
      email: 'user.login.data.email',
      password: 'user.login.data.password'
    }
  },
  handlers: {
    onCode200: [
      {
        fn: 'set',
        from: 'body.json-web-token',
        to: 'user.jwt'
      }
    ]
  },
  flags: {
    sending: 'user.login.api.sending'
  }
})
