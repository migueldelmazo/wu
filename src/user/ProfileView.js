import React from 'react'
import Component from '../libs/react'

export default class LoginView extends Component {

  onChange() {
    return 'user.profile'
  }

  render() {
    return (
      <div
        className='container'
        hidden={ !this.get('user.profile.route') }
      >
        <div className='row'>
          <div className='col-6'>
            <h3>Profile</h3>
            <ul>
              <li>
                Id:
                { this.get('user.profile', 'id') }
              </li>
              <li>
                Email:
                { this.get('user.profile', 'email') }
              </li>
              <li>
                Name:
                { this.get('user.profile', 'name') }
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

}
