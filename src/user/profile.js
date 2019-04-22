import _ from 'lodash'
import wu from '../libs/wu'

wu.create('router', 'user.profile', {
  urlPattern: '/profile/:userId',
  to: 'user.profile.route'
})

wu.create('watcher', 'user.profile.navigate', {
  onChange: {
    paths: ['user.jwt', 'user.profile.route']
  },
  args: ['#user.jwt', '#user.profile.route'],
  run: (userJwt, profileRoute) => {
    if (_.isEmpty(userJwt) && profileRoute.isValid) {
      _.navigate('/')
    }
  }
})

wu.create('getter', 'user.profile.route', {
  args: '#user.profile.route.isValid'
})

wu.create('getter', 'user.profile', {
  args: '#user.profile.data',
  run: (profile, prop) => (profile && profile[prop]) || ''
})

wu.create('api', 'user.profile', {
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
      args: {
        jwt: '#user.jwt'
      }
    }
  },
  handlers: {
    onCode200: [
      {
        run: (response) => response.body.user,
        to: 'user.profile.data'
      }
    ]
  },
  flags: {
    sending: 'user.profile.api.sending'
  }
})
