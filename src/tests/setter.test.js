import _ from 'lodash'
import wu from '../index'

describe('Check wu.create("setter") method', () => {

  beforeEach(wu.reset)

  test('Check run: should update new value', () => {
    const callback = {
      fn: (methodArg) => methodArg + '-changed'
    }
    const spy = jest.spyOn(callback, 'fn')
    wu.model.set('data', 'value')
    wu.create('setter', 'setter-name', {
      args: 'data',
      run: callback.fn,
      update: 'data-changed'
    })
    wu.setter('setter-name')
    expect(wu.model.get('data')).toBe('value')
    expect(wu.model.get('data-changed')).toBe('value-changed')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('Check default run: should update new value with first argument', () => {
    wu.model.set('data', 'value')
    wu.create('setter', 'setter-name', {
      args: 'data',
      update: 'data-changed'
    })
    wu.setter('setter-name')
    expect(wu.model.get('data')).toBe('value')
    expect(wu.model.get('data-changed')).toBe('value')
  })

  test('Check run: should update new value with model and method arguments', () => {
    const callback = {
      fn: (modelArg, methodArg) => modelArg + '-' + methodArg
    }
    const spy = jest.spyOn(callback, 'fn')
    wu.model.set('data', 'value')
    wu.create('setter', 'setter-name', {
      args: 'data',
      run: callback.fn,
      update: 'data-changed'
    })
    wu.setter('setter-name', 'changed')
    expect(wu.model.get('data')).toBe('value')
    expect(wu.model.get('data-changed')).toBe('value-changed')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('Check run: should update new value without model arguments and with method arguments', () => {
    const callback = {
      fn: (methodArg) => methodArg
    }
    const spy = jest.spyOn(callback, 'fn')
    wu.create('setter', 'setter-name', {
      run: callback.fn,
      update: 'data-changed'
    })
    wu.setter('setter-name', 'changed')
    expect(wu.model.get('data-changed')).toBe('changed')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('Check non existent setter: should log an error', () => {
    _.logError = (...args) => {
    }
    const spy = jest.spyOn(_, 'logError')
    wu.setter('non-existent-setter')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('Check invalid setter properties: should log an error', () => {
    _.logError = (...args) => {
    }
    const spy = jest.spyOn(_, 'logError')
    wu.create('setter', 'setter-name', {})
    wu.create('setter', 'setter-name', {
      run: null
    })
    wu.create('setter', 'setter-name', {
      update: null
    })
    expect(spy).toHaveBeenCalledTimes(3)
  })

})
