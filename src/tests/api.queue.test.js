import wu from '../index'
import common from './common'

describe('Check wu.create("api") method', () => {

  beforeEach(wu.reset)
  
  test('Check context: although the context has 2 items it must be called only once because the second call is ignored because it is the same as the first', (done) => {
    common.mockFetch({
      onChange: 'app.ready',
      request: {
        path: {
          run: (context) => 'https://server.com/' + context
        }
      },
      onResponse: {},
      options: {
        cacheable: false,
        context: [1, 1]
      }
    })
    wu.start()
    setTimeout(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1)
      global.fetch.mockClear()
      done()
    }, 100)
  })
})
