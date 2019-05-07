import _ from 'lodash'
import wu from '../index'
import common from './common'

describe('Check wu.create("api") method', () => {

  beforeEach(wu.reset)

  test('Check invalid api properties: should log an error', () => {
    _.logError = (...args) => {
    }
    const spy = jest.spyOn(_, 'logError')
    wu.create('api', 'api-name', {})
    wu.create('api', 'api-name', {
      onChange: null
    })
    wu.create('api', 'api-name', {
      onChange: 'data',
      when: null
    })
    wu.create('api', 'api-name', {
      onChange: 'data',
      when: {
        'data': null
      }
    })
    expect(spy).toHaveBeenCalledTimes(8)
  })

})
