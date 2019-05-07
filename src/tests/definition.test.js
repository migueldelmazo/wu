import _ from 'lodash'
import wu from '../index'

describe('Check wu.create("setter") method', () => {

  beforeEach(wu.reset)

  test('Check non existent definition type: should log an error', () => {
    _.logError = (...args) => {
    }
    const spy = jest.spyOn(_, 'logError')
    wu.create('non-existent-definition-type', 'name', {})
    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('Check invalid definition: should log an error', () => {
    _.logError = (...args) => {
    }
    const spy = jest.spyOn(_, 'logError')
    wu.create('ensurer', null, {})
    wu.create('ensurer', 'ensurer-name')
    expect(spy).toHaveBeenCalledTimes(4)
  })

})
