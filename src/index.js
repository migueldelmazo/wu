import React from 'react'
import ReactDom from 'react-dom'
import wu from './libs/wu'
import AppView from './app/AppView'
import './user/login'
import './user/profile'

wu.start()

ReactDom.render(<AppView />, document.getElementById('root'))
