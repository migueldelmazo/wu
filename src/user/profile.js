import _ from 'lodash'
import atom from '../libs/atom'

atom.create('router', 'user.profile', {
  urlPathName: '/profile/:userId',
  to: 'user.profile.route'
})

atom.create('watcher', 'user.profile.navigate', {
  onChange: {
    paths: ['user.jwt', 'user.profile.route']
  },
  from: ['#user.jwt', '#user.profile.route'],
  fn: (userJwt, profileRoute) => {
    if (_.isEmpty(userJwt) && profileRoute.isValid) {
      _.navigate('/')
    }
  }
})

atom.create('getter', 'user.profile.route', {
  from: '#user.profile.route.isValid'
})

atom.create('getter', 'user.profile', {
  from: '#user.profile.data',
  fn: (profile, prop) => (profile && profile[prop]) || ''
})

atom.create('api', 'user.profile', {
  onChange: {
    paths: 'user.jwt',
    check: {
      'user.jwt': [_.negate(_.isEmpty), _.isString]
    }
  },
  request: {
    method: 'get',
    path: '/profile.json',
    query: {
      from: {
        jwt: '#user.jwt'
      }
    }
  },
  handlers: {
    onCode200: [
      {
        fn: (response) => response.body.user,
        to: 'user.profile.data'
      }
    ]
  },
  flags: {
    sending: 'user.profile.api.sending'
  }
})
