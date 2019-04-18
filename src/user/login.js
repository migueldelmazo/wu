import _ from 'lodash'
import wu from '../libs/wu'

wu.create('router', 'userLogin', {
  urlPathName: '/',
  to: 'user.login.route'
})

wu.create('ensure', 'userLogin', {
  onChange: {
    paths: 'app.ready'
  },
  from: {
    email: '',
    password: ''
  },
  to: 'user.login.data'
})

wu.create('watcher', 'userLoginNavigate', {
  onChange: {
    paths: ['user.jwt', 'user.login.route']
  },
  from: ['#user.jwt', '#user.login.route'],
  fn: (userJwt, loginRoute) => {
    if (!_.isEmpty(userJwt) && loginRoute.isValid) {
      _.navigate('/profile/' + userJwt)
    }
  }
})

wu.create('getter', 'userLoginRoute', {
  from: '#user.login.route.isValid'
})

wu.create('getter', 'userLoginSending', {
  from: '#user.login.api.sending'
})

wu.create('setter', 'userLoginSend', {
  fn: (email, password) => ({
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
      from: {
        email: '#user.login.data.email',
        password: '#user.login.data.password'
      }
    }
  },
  handlers: {
    onCode200: [
      {
        fn: (response) => response.body.jsonWebToken,
        to: 'user.jwt'
      }
    ]
  },
  flags: {
    sending: 'user.login.api.sending'
  }
})
