import _ from 'lodash'
import wu from '../index'

describe('Check wu.model.stopWatching() method', () => {

  beforeEach(wu.reset)

  test('Check stop watching: should not call fn after stopping watching', (done) => {
    const callback = {
      fn: () => {
      }
    }
    const spy = jest.spyOn(callback, 'fn')
    const watcherId = wu.model.watch('data', callback.fn)
    wu.model.set('data', 'value')
    setTimeout(() => {
      expect(wu.model.get('data')).toBe('value')
      expect(spy).toHaveBeenCalledTimes(1)
      wu.model.stopWatching(watcherId)
      wu.model.set('data', 'value2')
    }, 10)
    setTimeout(() => {
      expect(wu.model.get('data')).toBe('value2')
      expect(spy).toHaveBeenCalledTimes(1)
      done()
    }, 10)
  })

})
