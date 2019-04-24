import React from 'react'
import Component from '../libs/react'

export default class LoginView extends Component {

  onChange() {
    return 'user.profile'
  }

  render() {
    const profile = this.get('userProfile')
    return (
      <div
        className='container'
        hidden={ !this.get('userProfileRoute') }
      >
        <div className='row'>
          <div className='col-6'>
            <h3>Profile</h3>
            <ul>
              <li>
                Id:
                { profile.id }
              </li>
              <li>
                Email:
                { profile.email }
              </li>
              <li>
                Name:
                { profile.name }
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

}
