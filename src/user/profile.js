import _ from 'lodash'
import wu from '../libs/wu'

wu.create('router', 'userProfile', {
  urlPattern: '/profile/:userId',
  update: 'user.profile.route'
})

wu.create('watcher', 'userProfileNavigate', {
  onChange: ['user.jwt', 'user.profile.route'],
  args: ['user.jwt', 'user.profile.route'],
  run: (userJwt, profileRoute) => {
    if (_.isEmpty(userJwt) && profileRoute.isActive) {
      _.navigate('/')
    }
  }
})

wu.create('getter', 'userProfileRoute', {
  args: 'user.profile.route.isActive'
})

wu.create('getter', 'userProfile', {
  args: 'user.profile.data',
  run: (profile, prop) => {
    profile = profile || {}
    return prop ? profile[prop] || '' : profile
  }
})

wu.create('api', 'userProfile', {
  onChange: 'user.jwt',
  when: {
    'user.jwt': [_.negate(_.isEmpty), _.isString]
  },
  request: {
    method: 'get',
    path: '/profile.json',
    query: {
      args: {
        jwt: 'user.jwt'
      }
    }
  },
  handlers: {
    onCode200: [
      {
        run: (response) => response.body.user,
        update: 'user.profile.data'
      }
    ]
  },
  flags: {
    sending: 'user.profile.api.sending'
  }
})
