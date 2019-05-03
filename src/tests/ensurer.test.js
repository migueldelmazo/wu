import _ from 'lodash'
import wu from '../index'

describe('Check wu.create("ensure") method', () => {

  beforeEach(wu.reset)

  test('Check ensurer: should ensure new path when watcher path changes', (done) => {
    const callback = {
      fn: (data) => data + '-changed'
    }
    const spy = jest.spyOn(callback, 'fn')
    wu.create('ensurer', 'ensurer name', {
      onChange: 'data',
      when: {
        data: _.isString
      },
      args: 'data',
      run: callback.fn,
      update: 'data-changed'
    })
    wu.model.set('data', 'value')
    setTimeout(() => {
      expect(wu.model.get('data')).toBe('value')
      expect(wu.model.get('data-changed')).toBe('value-changed')
      expect(spy).toHaveBeenCalledTimes(1)
      done()
    }, 10)
  })

  test('Check ensurer: should set path when the same watcher path changes', (done) => {
    const callback = {
      fn: () => 'value-changed'
    }
    const spy = jest.spyOn(callback, 'fn')
    wu.create('ensurer', 'ensurer name', {
      onChange: 'data',
      when: {
        data: _.isString
      },
      run: callback.fn,
      update: 'data'
    })
    wu.model.set('data', 'value')
    setTimeout(() => {
      expect(wu.model.get('data')).toBe('value-changed')
      expect(spy).toHaveBeenCalledTimes(2)
      done()
    }, 10)
  })

  test('Check default run: run should return the first argument', (done) => {
    wu.create('ensurer', 'ensurer name', {
      onChange: 'data',
      args: 'data',
      update: 'data-changed'
    })
    wu.model.set('data', 'value')
    setTimeout(() => {
      expect(wu.model.get('data')).toBe('value')
      expect(wu.model.get('data-changed')).toBe('value')
      done()
    }, 10)
  })

  test('Check when: you should not set path because the validators do not match', (done) => {
    const callback = {
      fn: (data) => 'value-changed'
    }
    const spy = jest.spyOn(callback, 'fn')
    wu.create('ensurer', 'ensurer name', {
      onChange: 'data',
      when: {
        data: _.isNumber
      },
      args: 'data',
      run: callback.fn,
      update: 'data'
    })
    wu.model.set('data', 'value')
    setTimeout(() => {
      expect(wu.model.get('data')).toBe('value')
      expect(spy).toHaveBeenCalledTimes(0)
      done()
    }, 10)
  })

})
