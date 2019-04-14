import _ from 'lodash'
import atom from '../libs/atom'

// routers

atom.create('router', 'user.login', {
  urlPathName: '/login',
  destination: 'user.route.login'
})

atom.create('router', 'user.page', {
  urlPathName: '/page/:id',
  destination: 'user.route.page'
})

// apis

atom.create('api', 'user.login', {
  request: {
    method: 'get',
    path: 'login.json',
    query: {
      email: 'info@migueldelmazo.com'
    }
  },
  handlers: {
    onCode200: {
      validator: {
        'body.json-web-token': [_.negate(_.isEmpty), _.isString]
      },
      mapper: {
        'body.json-web-token': 'body.jwt'
      },
      parser: {
        'body.jwt': _.trim
      },
      destination: {
        'user.jwt': 'body.jwt'
      }
    }
  },
  flags: {
    sending: 'user.login.sending'
  }
})

// ensure

atom.create('ensure', 'user.isLogged', {
  watcher: 'user.id',
  args: 'user.id',
  fn: (id) => !_.isEmpty(id),
  destination: 'user.isLogged'
})

atom.create('watcher', 'user.api.login', {
  watcher: 'app.init',
  fn: () => {
    atom.api.send('user.login')
  }
})

// view

atom.create('getter', 'app.status', {
  args: 'app.init',
  fn: (appInit) => appInit
})
