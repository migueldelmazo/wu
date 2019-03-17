import _ from 'lodash'
import { atom } from './common'
import api from './api'
import ensure from './ensure'
import model from './model'
import router from './router'
import view from './view'

import './lodash'

// import libs into atom
const libs = {
  api,
  ensure,
  model,
  router,
  view
}
_.each(libs, (methods, lib) => {
  _.each(methods, (method, name) => {
    atom[lib][name] = (...args) => method(...args)
  })
})

api.init(atom)
router.init(atom)

export default atom

window.atom = atom
