import _ from 'lodash'
import atom from '../libs/atom'

atom.create('router', 'user.profile', {
  urlPathName: '/profile/:userId',
  destination: 'user.profile.route'
})

atom.create('watcher', 'user.profile.navigate', {
  watcher: ['user.jwt', 'user.profile.route'],
  args: ['user.jwt', 'user.profile.route'],
  fn: (userJwt, profileRoute) => {
    if (_.isEmpty(userJwt) && profileRoute.isValid) {
      _.navigate('/login')
    }
  }
})

atom.create('getter', 'user.profile.route', {
  args: 'user.profile.route.isValid'
})

atom.create('getter', 'user.profile', {
  args: 'user.profile.data',
  fn: (profile, prop) => (profile && profile[prop]) || ''
})

atom.create('api', 'user.profile', {
  watcher: {
    paths: 'user.jwt',
    validator: {
      'user.jwt': [_.negate(_.isEmpty), _.isString]
    }
  },
  request: {
    method: 'get',
    path: '/profile.json',
    query: {
      jwt: 'user.jwt'
    }
  },
  handlers: {
    onCode200: [
      {
        fn: 'set',
        from: 'body.user',
        to: 'user.profile.data'
      }
    ]
  },
  flags: {
    sending: 'user.profile.api.sending'
  }
})
