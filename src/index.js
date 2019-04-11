import React from 'react'
import ReactDom from 'react-dom'
import atom from './libs/atom'

import './user/login'
import './user/profile'

import UserLoginView from './user/UserLoginView'

atom.init()

ReactDom.render(<UserLoginView />, document.getElementById('root'))

_.consoleLog('atom', 'Atom', atom)
