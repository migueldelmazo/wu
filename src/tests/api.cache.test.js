import wu from '../index'
import common from './common'

describe('Check wu.create("api") method', () => {

  beforeEach(wu.reset)
  
  test('Check cacheable option: should be true by default', (done) => {
    common.mockFetch({
      onChange: 'app.ready',
      request: {
        path: 'https://server.com'
      },
      onResponse: {
        complete: {
          run: (response, request) => {
            expect(request.options.cacheable).toBe(true)
            global.fetch.mockClear()
            done()
          }
        }
      }
    })
    wu.start()
  })
  
  test('Check cacheable option: should be false', (done) => {
    common.mockFetch({
      onChange: 'app.ready',
      request: {
        path: 'https://server.com'
      },
      onResponse: {
        complete: {
          run: (response, request) => {
            expect(request.options.cacheable).toBe(false)
            global.fetch.mockClear()
            done()
          }
        }
      },
      options: {
        cacheable: false
      }
    })
    wu.start()
  })
  
  test('Check cache: second request should response from server because options.cacheable is false', (done) => {
    common.mockFetch({
      onChange: ['app.ready', 'secondRequestSent'],
      request: {
        path: 'https://server.com'
      },
      onResponse: {
        complete: {
          run: (response, request) => {
            if (wu.model.get('secondRequestSent') !== true) {
              // first request: from server
              wu.model.set('secondRequestSent', true)
              expect(response.body.one).toBe(1)
              expect(request.options.fromCache).toBe(false)
            } else {
              // second request: from server too
              expect(response.body.one).toBe(1)
              expect(request.options.fromCache).toBe(false)
              expect(global.fetch).toHaveBeenCalledTimes(2)
              global.fetch.mockClear()
              done()
            }
          }
        }
      },
      options: {
        cacheable: false
      }
    }, '{"one":1}')
    wu.start()
  })
  
  test('Check cache: second request should response from server because response status is 404', (done) => {
    common.mockFetch({
      onChange: ['app.ready', 'secondRequestSent'],
      request: {
        path: 'https://server.com'
      },
      onResponse: {
        complete: {
          run: (response, request) => {
            if (wu.model.get('secondRequestSent') !== true) {
              // first request: from server
              wu.model.set('secondRequestSent', true)
              expect(response.body.one).toBe(1)
              expect(request.options.fromCache).toBe(false)
            } else {
              // second request: from server too
              expect(response.body.one).toBe(1)
              expect(request.options.fromCache).toBe(false)
              expect(global.fetch).toHaveBeenCalledTimes(2)
              global.fetch.mockClear()
              done()
            }
          }
        }
      }
    }, '{"one":1}', {}, 404)
    wu.start()
  })
  
  test('Check cache: second request should response from server because method is not GET', (done) => {
    common.mockFetch({
      onChange: ['app.ready', 'secondRequestSent'],
      request: {
        method: 'post',
        path: 'https://server.com'
      },
      onResponse: {
        complete: {
          run: (response, request) => {
            if (wu.model.get('secondRequestSent') !== true) {
              // first request: from server
              wu.model.set('secondRequestSent', true)
              expect(response.body.one).toBe(1)
              expect(request.options.fromCache).toBe(false)
            } else {
              // second request: from server too
              expect(response.body.one).toBe(1)
              expect(request.options.fromCache).toBe(false)
              expect(global.fetch).toHaveBeenCalledTimes(2)
              global.fetch.mockClear()
              done()
            }
          }
        }
      }
    }, '{"one":1}')
    wu.start()
  })
  
  test('Check cache: second request should response from server because response has an error', (done) => {
    common.mockFetch({
      onChange: ['app.ready', 'secondRequestSent'],
      request: {
        path: 'https://server.com'
      },
      onResponse: {
        complete: {
          run: (response, request) => {
            if (wu.model.get('secondRequestSent') !== true) {
              // first request: from server
              wu.model.set('secondRequestSent', true)
              expect(request.options.fromCache).toBe(false)
            } else {
              // second request: from server too
              expect(request.options.fromCache).toBe(false)
              expect(global.fetch).toHaveBeenCalledTimes(2)
              global.fetch.mockClear()
              done()
            }
          }
        }
      }
    }, 'error response')
    wu.start()
  })
  
  test('Check cache: second request should response from cache', (done) => {
    common.mockFetch({
      onChange: ['app.ready', 'secondRequestSent'],
      request: {
        path: 'https://server.com'
      },
      onResponse: {
        complete: {
          run: (response, request) => {
            if (wu.model.get('secondRequestSent') !== true) {
              // first request: from server
              wu.model.set('secondRequestSent', true)
              expect(response.body.one).toBe(1)
              expect(request.options.fromCache).toBe(false)
            } else {
              // second request: from cache
              expect(response.body.one).toBe(1)
              expect(request.options.fromCache).toBe(true)
              expect(global.fetch).toHaveBeenCalledTimes(1)
              global.fetch.mockClear()
              done()
            }
          }
        }
      }
    }, '{"one":1}')
    wu.start()
  })
      
})
