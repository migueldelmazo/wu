import React from 'react'
import ReactDom from 'react-dom'
import atom from './libs/atom'
import AppView from './app/AppView'
import './user/login'
import './user/profile'

atom.start()

ReactDom.render(<AppView />, document.getElementById('root'))
