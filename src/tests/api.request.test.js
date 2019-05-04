import wu from '../index'
import common from './common'

describe('Check wu.create("api") method', () => {

  beforeEach(wu.reset)
  
  test('Check implicit request data: should fetch a request', (done) => {
    common.mockFetch({
      onChange: 'app.ready',
      request: {
        method: 'post',
        path: 'https://server.com',
        query: {
          one: 1
        },
        body: {
          two: 2
        },
        headers: {
          three: 3
        }
      },
      onResponse: {
        complete: {
          run: (response, request) => {
            expect(request.request).toStrictEqual({
              method: 'POST',
              path: 'https://server.com',
              query: {
                one: 1
              },
              body: {
                two: 2
              },
              headers: {
                three: 3
              }
            })
            expect(global.fetch).toHaveBeenCalledWith('https://server.com?one=1', {
              body: JSON.stringify({ two: 2 }),
              headers: {
                three: 3
              },
              method: 'POST'
            })
            expect(global.fetch).toHaveBeenCalledTimes(1)
            global.fetch.mockClear()
            done()
          }
        }
      }
    })
    wu.start()
  })
    
  test('Check definition request data: should fetch a request', (done) => {
    common.mockFetch({
      onChange: 'app.ready',
      request: {
        method: {
          args: 'custom.method'
        },
        path: {
          run: () => 'https://server.com'
        },
        query: {
          args: 'custom.query'
        },
        body: {
          run: () => ({ two: 2 })
        },
        headers: {
          run: () => ({ three: 3 })
        }
      },
      onResponse: {
        complete: {
          run: (response, request) => {
            expect(request.request).toStrictEqual({
              method: 'POST',
              path: 'https://server.com',
              query: {
                one: 1
              },
              body: {
                two: 2
              },
              headers: {
                three: 3
              }
            })
            expect(global.fetch).toHaveBeenCalledWith('https://server.com?one=1', {
              body: JSON.stringify({ two: 2 }),
              headers: {
                three: 3
              },
              method: 'POST'
            })
            expect(global.fetch).toHaveBeenCalledTimes(1)
            global.fetch.mockClear()
            done()
          }
        }
      }
    })
    wu.model.set('custom.method', 'post')
    wu.model.set('custom.query', { one: 1 })
    wu.start()
  })
  
})
