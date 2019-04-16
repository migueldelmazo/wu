import React from 'react'
import Component from '../libs/react'
import LoginView from '../user/LoginView'
import ProfileView from '../user/ProfileView'

export default class AppView extends Component {

  render() {
    return (
      <div className='container'>
        <LoginView />
        <ProfileView />
      </div>
    )
  }

}
