import _ from 'lodash'
import React from 'react'
import ReactDom from 'react-dom'
import atom from './libs/atom'

import userLoginApi from './user/login/api'
import userLoginEnsures from './user/login/ensures'
import userLoginRouter from './user/login/router'
import userLoginView from './user/login/view'
import UserLoginView from './user/login/UserLoginView'

atom.api.create(userLoginApi)
atom.ensure.create(userLoginEnsures)
atom.router.create(userLoginRouter)
atom.view.create(userLoginView)

_.consoleLog('atom', 'Atom', atom)

ReactDom.render(<UserLoginView />, document.getElementById('root'))
