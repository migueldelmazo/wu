import React from 'react'
import Component from '../libs/react'

export default class UserLoginView extends Component {
  
  watchers () {
    return 'user.id'
  }
  
  initialState () {
    return {
      email: 'email@email.com',
      item: true,
      item2: true
    }
  }

  parseData() {}

  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-4'>
          
            <div className='form-group'>
              <label>
                Email:
              </label>
              <input
                className='form-control'
                onKeyUp={this.onEv('parseData', '#this.state.email', true)}
              />
            </div>
            
            <div className='form-group'>
              <label>
                Password:
              </label>
              <input
                className='form-control'
              />
            </div>
            
            <input
              type="checkbox"
              onChange={this.onEv(['setState', 'item'], ['parseData', '#this.state.item'])}
            />
            
          </div>
          <div className='col-4'>
          
            <a
              className='btn btn-primary'
              href={ '/page/' + Date.now() + '?param=one#hash' }
            >Navigate to page</a>
            
            <a
              className='btn btn-primary'
              href={ '/login' }
            >Navigate to login</a>
            
            <br />
          
            <button
              className='btn btn-primary'
              onClick={ this.onEv('parseData', '#this.state.email')}
            >Parse state</button>
            
          </div>
          <div className='col-4'>
            
            <button
              className='btn btn-primary'
              onClick={this.onEv('toggleState', 'item')}
            >Toggle</button>
            
            &nbsp;
              
            <button
              className='btn btn-primary'
              onClick={this.onEv('setState', 'item', true)}
            >True</button>
            
            &nbsp;
              
            <button
              className='btn btn-primary'
              onClick={this.onEv('setState', 'item', false)}
            >False</button>
            
            &nbsp;
              
            <button
              className='btn btn-primary'
              onClick={this.onEv(['setState', 'item', false], ['setState', 'item2', false])}
            >All false</button>
            
            &nbsp;
              
            <button
              className='btn btn-primary'
              onClick={this.onEv(['setState', 'item', true], ['parseData', 'item2', true])}
            >All true</button>
            
            <br />
            
            <code>
              this.state.item: {this.state.item + ''}
              <br />
              this.state.item2: {this.state.item2 + ''}
              <br />
              app.status: {this.get('appStatus') + ''}
            </code>
          </div>
        </div>
      </div>
    )
  }

}
