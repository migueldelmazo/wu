import React from 'react'
import ReactDom from 'react-dom'
import atom from './libs/atom'
import UserLoginView from './user/UserLoginView'

import './user/login'

atom.init()

atom.model.set('app.init', true)
atom.model.set('user.id', 1)

ReactDom.render(<UserLoginView />, document.getElementById('root'))
