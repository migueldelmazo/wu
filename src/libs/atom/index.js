import _ from 'lodash'
import action from './action'
import api from './api'
import ensure from './ensure'
import getter from './getter'
import model from './model'
import router from './router'

import './lodash'

// atom public object
const atom = {
  action: {},
  api: {},
  ensure: {},
  getter: {},
  model: {
    __data: {},
    __listeners: {}
  },
  router: {}
}

// import libs into atom
const libs = {
  action,
  api,
  ensure,
  getter,
  model,
  router
}
_.each(libs, (methods, lib) => {
  _.each(methods, (method, name) => {
    atom[lib][name] = (...args) => method(atom, ...args)
  })
})

router.init(atom)

export default atom

window.atom = atom
