import _ from 'lodash'
import { atom } from './common'
import action from './action'
import api from './api'
import ensure from './ensure'
import getter from './getter'
import model from './model'
import router from './router'

import './lodash'

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
    atom[lib][name] = (...args) => method(...args)
  })
})

router.init(atom)

export default atom

window.atom = atom
