import React from 'react'
import Component from '../../libs/react'
import atom from '../../libs/atom'

export default class UserLoginView extends Component {

  getConfig() {
    return {
      name: 'UserLoginView',
      listeners: ['user.id', 'user.login.route'],
      state: {
        email: 'email@email.com',
        isTrue: true
      }
    }
  }

  send() {
    atom.view.user.sendLogin({
      email: 'info@migueldelmazo.com',
      password: '12345678'
    })
  }

  rndr() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-6'>
            <p>
              Id:
              { atom.model.get('user.id') }
            </p>
            <p>
              Email:
              { this.state.email }
            </p>
            <p>
              isTrue:
              { this.state.isTrue + '' }
            </p>
            <p>
              user.model.router:
              { atom.model.get('user.login.route.isValid') + '' }
            </p>
            <p>
              Time:
              { Date.now() }
            </p>
          </div>
          <div className='col-6'>
            <button
              className='btn btn-primary'
              onClick={ this.onEvent('send', 'user.login', {
                          email: '#this.state.email',
                          password: '#this.props.foo'
                        }) }
            >
              Send
            </button>
            <button
              className='btn btn-primary'
              onClick={ this.onEvent('setState', {
                          email: 'info@migueldelmazo.com'
                        }) }
            >
              Set
            </button>
            <button
              className='btn btn-primary'
              onClick={ this.onEvent('toggleState', 'isTrue') }
            >
              Toggle
            </button>
            <a
              className='btn btn-primary'
              href={ '/page-' + Date.now() }
            >Navigate</a>
            <a
              className='btn btn-primary'
              href='/user/login'
            >User login</a>
          </div>
        </div>
      </div>
    )
  }

}
