import _ from 'lodash'
import wu from '../index'

describe('Check wu.create("watcher") method', () => {

  beforeEach(wu.reset)

  test('Check run: should call run when watcher path changes', (done) => {
    const callback = {
      fn: () => {
      }
    }
    const spy = jest.spyOn(callback, 'fn')
    wu.create('watcher', 'watcher name', {
      onChange: 'data',
      when: {
        data: _.isString
      },
      run: callback.fn
    })
    wu.model.set('data', 'value')
    setTimeout(() => {
      expect(spy).toHaveBeenCalledTimes(1)
      done()
    }, 10)
  })

  test('Check validators: should not call run when watcher path changes', (done) => {
    const callback = {
      fn: () => {
      }
    }
    const spy = jest.spyOn(callback, 'fn')
    wu.create('watcher', 'watcher name', {
      onChange: 'data',
      when: {
        data: _.isNumber
      },
      run: callback.fn
    })
    wu.model.set('data', 'value')
    setTimeout(() => {
      expect(spy).toHaveBeenCalledTimes(0)
      done()
    }, 10)
  })

})
