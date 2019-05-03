import _ from 'lodash'
import wu from '../index'

describe('Check wu.model.watch() method', () => {

  beforeEach(wu.reset)

  test('Check paths: should call fn when watched path is the same than changed path', (done) => {
    const callback = {
      fn: () => {
      }
    }
    const spy = jest.spyOn(callback, 'fn')
    wu.model.watch('data', callback.fn)
    wu.model.set('data', 'value')
    setTimeout(() => {
      expect(wu.model.get('data')).toBe('value')
      expect(spy).toHaveBeenCalledTimes(1)
      done()
    }, 10)
  })

  test('Check paths: should call fn when watched path is son of changed path', (done) => {
    const callback = {
      fn: () => {
      }
    }
    const spy = jest.spyOn(callback, 'fn')
    wu.model.watch('data', callback.fn)
    wu.model.set('data.prop', 'value')
    setTimeout(() => {
      expect(wu.model.get('data.prop')).toBe('value')
      expect(spy).toHaveBeenCalledTimes(1)
      done()
    }, 10)
  })

  test('Check paths: should call fn when watched path is parent of changed path', (done) => {
    const callback = {
      fn: () => {
      }
    }
    const spy = jest.spyOn(callback, 'fn')
    wu.model.watch('data.prop', callback.fn)
    wu.model.set('data', 'value')
    setTimeout(() => {
      expect(wu.model.get('data')).toBe('value')
      expect(spy).toHaveBeenCalledTimes(1)
      done()
    }, 10)
  })

  test('Check paths: should call fn when watched path is son of changed path with arrays', (done) => {
    const callback = {
      fn: () => {
      }
    }
    const spy = jest.spyOn(callback, 'fn')
    wu.model.watch('data', callback.fn)
    wu.model.set('data[0]', 'value')
    setTimeout(() => {
      expect(wu.model.get('data[0]')).toBe('value')
      expect(spy).toHaveBeenCalledTimes(1)
      done()
    }, 10)
  })

  test('Check paths: should call fn when watched path is son of changed path with arrays', (done) => {
    const callback = {
      fn: () => {
      }
    }
    const spy = jest.spyOn(callback, 'fn')
    wu.model.watch('data[0]', callback.fn)
    wu.model.set('data', [1, 2])
    setTimeout(() => {
      expect(wu.model.get('data')).toStrictEqual([1, 2])
      expect(spy).toHaveBeenCalledTimes(1)
      done()
    }, 10)
  })

  test('Check callbacks: should call function once when the same value is set several times', (done) => {
    const callback = {
      fn: () => {
      }
    }
    const spy = jest.spyOn(callback, 'fn')
    wu.model.watch('data', callback.fn)
    wu.model.set('data', 'value')
    wu.model.set('data', 'value')
    setTimeout(() => {
      expect(wu.model.get('data')).toBe('value')
      expect(spy).toHaveBeenCalledTimes(1)
      done()
    }, 10)
  })

  test('Check callbacks: should call the callbacks in order of observation', (done) => {
    const orderCalls = []
    const callback = {
      fn1: () => orderCalls.push(1),
      fn2: () => orderCalls.push(2),
      fn3: () => orderCalls.push(3)
    }
    const spy1 = jest.spyOn(callback, 'fn1')
    const spy2 = jest.spyOn(callback, 'fn2')
    const spy3 = jest.spyOn(callback, 'fn3')
    wu.model.watch('data', callback.fn1)
    wu.model.watch('data', callback.fn2)
    wu.model.watch('data', callback.fn3)
    wu.model.set('data', 'value')
    setTimeout(() => {
      expect(wu.model.get('data')).toBe('value')
      expect(orderCalls).toStrictEqual([1, 2, 3])
      expect(spy1).toHaveBeenCalledTimes(1)
      expect(spy2).toHaveBeenCalledTimes(1)
      expect(spy3).toHaveBeenCalledTimes(1)
      done()
    }, 10)
  })

  test('Check callbacks: should call the "ensurer" type callbacks before "default" type callbacks', (done) => {
    const orderCalls = []
    const callback = {
      fn1: () => {
        orderCalls.push('default')
      },
      fn2: () => {
        orderCalls.push('ensurer')
        wu.model.set('data', 'value2')
      }
    }
    const spy1 = jest.spyOn(callback, 'fn1')
    const spy2 = jest.spyOn(callback, 'fn2')
    wu.model.watch('data', callback.fn1)
    wu.model.watch('data', callback.fn2, undefined, {
      type: 'ensurer'
    })
    wu.model.set('data', 'value')
    setTimeout(() => {
      expect(wu.model.get('data')).toBe('value2')
      expect(orderCalls).toStrictEqual(['ensurer', 'ensurer', 'default'])
      expect(spy1).toHaveBeenCalledTimes(1)
      expect(spy2).toHaveBeenCalledTimes(2)
      done()
    }, 10)
  })

  test('Check validators: should call fn after checking validators', (done) => {
    const callback = {
      fn: () => {
      }
    }
    const spy = jest.spyOn(callback, 'fn')
    wu.model.watch('data', callback.fn, {
      data: [_.negate(_.isEmpty), _.isString],
      boolean01: (value) => value === true
    })
    wu.model.set('data', 'value')
    wu.model.set('boolean01', true)
    setTimeout(() => {
      expect(wu.model.get('data')).toBe('value')
      expect(wu.model.get('boolean01')).toBe(true)
      expect(spy).toHaveBeenCalledTimes(1)
      done()
    }, 10)
  })

  test('Check validators: should not call fn after checking validators', (done) => {
    const callback = {
      fn: () => {
      }
    }
    const spy = jest.spyOn(callback, 'fn')
    wu.model.watch('data', callback.fn, {
      data: [_.negate(_.isEmpty), _.isString]
    })
    wu.model.set('data', false)
    setTimeout(() => {
      expect(spy).toHaveBeenCalledTimes(0)
      done()
    }, 10)
  })

})
