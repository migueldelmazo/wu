import _ from 'lodash'
import wu from '../index'

describe('Check wu.create("getter") method', () => {

  beforeEach(wu.reset)

  test('Check run: should return new value', () => {
    const callback = {
      fn: (methodArg) => methodArg + '-changed'
    }
    const spy = jest.spyOn(callback, 'fn')
    wu.model.set('data', 'value')
    wu.create('getter', 'getter-name', {
      args: 'data',
      run: callback.fn
    })
    expect(wu.model.get('data')).toBe('value')
    expect(wu.getter('getter-name')).toBe('value-changed')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('Check default run: should return new value with first argument', () => {
    wu.model.set('data', 'value')
    wu.create('getter', 'getter-name', {
      args: 'data'
    })
    expect(wu.model.get('data')).toBe('value')
    expect(wu.getter('getter-name')).toBe('value')
  })

  test('Check run: should return new value with model and method arguments', () => {
    const callback = {
      fn: (modelArg, methodArg) => modelArg + '-' + methodArg
    }
    const spy = jest.spyOn(callback, 'fn')
    wu.model.set('data', 'value')
    wu.create('getter', 'getter-name', {
      args: 'data',
      run: callback.fn
    })
    expect(wu.model.get('data')).toBe('value')
    expect(wu.getter('getter-name', 'changed')).toBe('value-changed')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('Check non existent getter: should log an error', () => {
    _.logError = (...args) => {}
    const spy = jest.spyOn(_, 'logError')
    wu.getter('non-existent-getter')
    expect(spy).toHaveBeenCalledTimes(1)
  })

})
