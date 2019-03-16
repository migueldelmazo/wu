import UserLoginView from './user/login/view'
import _ from 'lodash'
import React from 'react'
import ReactDom from 'react-dom'
import atom from './libs/atom'

import userLoginApi from './user/login/api'
import userLoginEnsures from './user/login/ensures'
import userLoginGetters from './user/login/getters'
import userLoginRouter from './user/login/router'

atom.api.create(userLoginApi)
atom.ensure.create(userLoginEnsures)
atom.getter.create(userLoginGetters)
atom.router.create(userLoginRouter)

_.consoleLog('atom', 'Atom', atom)

ReactDom.render(<UserLoginView />, document.getElementById('root'))
