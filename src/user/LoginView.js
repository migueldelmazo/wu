import React from 'react'
import Component from '../libs/react'

export default class LoginView extends Component {

  watchers() {
    return 'user.login'
  }

  initialState() {
    return {
      email: 'info@migueldelmazo.com',
      password: '12345678'
    }
  }

  render() {
    return (
      <div
        className='container'
        hidden={ !this.get('userLoginRoute') }
      >
        <div className='row'>
          <div className='col-6'>
            <h3>Login</h3>
            <div className='form-group row'>
              <label className='col-sm-4 col-form-label'>
                Email:
              </label>
              <div className='col-sm-8'>
                <input
                  className='form-control'
                  defaultValue={ this.state.email }
                  onKeyUp={ this.onEv('setState', 'email') }
                />
              </div>
            </div>
            <div className='form-group row'>
              <label className='col-sm-4 col-form-label'>
                Password:
              </label>
              <div className='col-sm-8'>
                <input
                  className='form-control'
                  defaultValue={ this.state.password }
                  onKeyUp={ this.onEv('setState', 'password') }
                />
              </div>
            </div>
            <button
              className='btn btn-primary'
              onClick={ this.onEv('userLoginSend', '#this.state.email', '#this.state.password') }
            >
              { this.get('userLoginSending') ? 'Enviando...' : 'Login' }
            </button>
          </div>
        </div>
      </div>
    )
  }

}
