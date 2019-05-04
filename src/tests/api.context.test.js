import wu from '../index'
import common from './common'

describe('Check wu.create("api") method', () => {

  beforeEach(wu.reset)
  
  test('Check context: shold send 3 calls because context is [1, 2, 3]', (done) => {
    common.mockFetch({
      onChange: 'app.ready',
      request: {
        path: {
          run: (context) => 'https://server.com/' + context
        }
      },
      onResponse: {
        complete: {
          args: ['result'],
          run: (result = [], response, request) => {
            result.push(request.options.context)
            return result
          },
          update: 'result'
        }
      },
      options: {
        context: {
          args: ['items'],
          run: (items) => items
        }
      }
    })
    
    // watcher to wait until call finish
    wu.create('watcher', 'wait 3 calls', {
      onChange: 'result',
      args: ['result'],
      run: (result = []) => {
        if (result.length === 3) {
          expect(result).toStrictEqual([1, 2, 3])
          expect(global.fetch).toHaveBeenCalledTimes(3)
          global.fetch.mockClear()
          done()
        }
      }
    })
    
    wu.model.set('items', [1, 2, 3])
    wu.start()
  })
  
  test('Check context: shold send 0 calls because context is []', (done) => {
    common.mockFetch({
      onChange: 'app.ready',
      request: {
        path: 'https://server.com/' + Math.random()
      },
      onResponse: {},
      options: {
        context: []
      }
    })
    wu.start()
    setTimeout(() => {
      expect(global.fetch).toHaveBeenCalledTimes(0)
      global.fetch.mockClear()
      done()
    }, 100)
  })
        
})
