import wu from '../index'
import common from './common'

describe('Check wu.create("api") method', () => {

  beforeEach(wu.reset)

  test('Check response arguments: should run actions with "response" and "request" arguments', (done) => {
    common.mockFetch({
      onChange: 'app.ready',
      request: {
        path: 'https://server.com'
      },
      onResponse: {
        complete: {
          run: (response, request) => {
            expect(response.body).toStrictEqual({
              one: 1
            })
            expect(response.error).toBe(false)
            expect(response.errorMessage).toBe('')
            expect(response.headers).toStrictEqual({
              two: 2
            })
            expect(response.status).toBe(201)
            global.fetch.mockClear()
            done()
          }
        }
      }
    }, '{"one":1}', {
      two: 2
    }, 201)
    wu.start()
  })

  test('Check response arguments: should run actions with "response" and "request" arguments (with error)', (done) => {
    common.mockFetch({
      onChange: 'app.ready',
      request: {
        path: 'https://server.com'
      },
      onResponse: {
        complete: {
          run: (response, request) => {
            expect(response.body).toStrictEqual({})
            expect(response.error).toBe(true)
            expect(response.errorMessage).toBe('Unexpected token s in JSON at position 0')
            expect(response.headers).toStrictEqual({
              two: 2
            })
            expect(response.status).toBe(503)
            global.fetch.mockClear()
            done()
          }
        }
      }
    }, 'server error', {
      two: 2
    }, 503)
    wu.start()
  })

  test('Check response handlers order: should run success handler', (done) => {
    const responses = []
    common.mockFetch({
      onChange: 'app.ready',
      request: {
        path: 'https://server.com'
      },
      onResponse: {
        init: {
          run: () => responses.push('init')
        },
        status200: {
          run: () => responses.push('status200')
        },
        success: {
          run: () => responses.push('success')
        },
        error: {
          run: () => responses.push('error')
        },
        complete: [
          {
            run: () => responses.push('complete')
          },
          {
            run: () => {
              expect(responses).toStrictEqual(['init', 'status200', 'success', 'complete'])
              global.fetch.mockClear()
              done()
            }
          }
        ]
      }
    })
    wu.start()
  })

  test('Check response handlers order: should run error handler', (done) => {
    const responses = []
    common.mockFetch({
      onChange: 'app.ready',
      request: {
        path: 'https://server.com'
      },
      onResponse: {
        init: {
          run: () => responses.push('init')
        },
        status200: {
          run: () => responses.push('status200')
        },
        success: {
          run: () => responses.push('success')
        },
        error: {
          run: () => responses.push('error')
        },
        complete: [
          {
            run: () => responses.push('complete')
          },
          {
            run: () => {
              expect(responses).toStrictEqual(['init', 'status200', 'error', 'complete'])
              global.fetch.mockClear()
              done()
            }
          }
        ]
      }
    }, 'error response')
    wu.start()
  })

  test('Check response handlers order: should run custom handler', (done) => {
    const responses = []
    common.mockFetch({
      onChange: 'app.ready',
      request: {
        path: 'https://server.com'
      },
      onResponse: {
        init: {
          run: () => responses.push('init')
        },
        status200: {
          run: () => responses.push('status200')
        },
        myCustomHandler: {
          run: () => responses.push('myCustomHandler')
        },
        success: {
          run: () => responses.push('success')
        },
        error: {
          run: () => responses.push('error')
        },
        complete: [
          {
            run: () => responses.push('complete')
          },
          {
            run: () => {
              expect(responses).toStrictEqual(['init', 'myCustomHandler', 'success', 'complete'])
              global.fetch.mockClear()
              done()
            }
          }
        ]
      },
      options: {
        handler: {
          run: () => 'myCustomHandler'
        }
      }
    })
    wu.start()
  })

  test('Check invalid custom handler: should run default handler', (done) => {
    const responses = []
    common.mockFetch({
      onChange: 'app.ready',
      request: {
        path: 'https://server.com'
      },
      onResponse: {
        init: {
          run: () => responses.push('init')
        },
        status200: {
          run: () => responses.push('status200')
        },
        myCustomHandler: {
          run: () => responses.push('myCustomHandler')
        },
        success: {
          run: () => responses.push('success')
        },
        complete: [
          {
            run: () => responses.push('complete')
          },
          {
            run: () => {
              expect(responses).toStrictEqual(['init', 'status200', 'success', 'complete'])
              global.fetch.mockClear()
              done()
            }
          }
        ]
      },
      options: {
        handler: {
          // invalid handler
          run: () => undefined
        }
      }
    })
    wu.start()
  })

  test('Check response custom handlers arguments: should receive response, request and options', (done) => {
    common.mockFetch({
      onChange: 'app.ready',
      request: {
        path: 'https://server.com'
      },
      onResponse: {},
      options: {
        handler: {
          run: (response, request, options) => {
            expect(request.path).toBe('https://server.com')
            expect(response.status).toBe(200)
            expect(options.cacheable).toBe(true)
            global.fetch.mockClear()
            done()
          }
        }
      }
    })
    wu.start()
  })

  test('Check response handlers order: should run several actions (with array)', (done) => {
    const responses = []
    common.mockFetch({
      onChange: 'app.ready',
      request: {
        path: 'https://server.com'
      },
      onResponse: {
        success: [
          {
            run: () => true,
            update: 'first'
          },
          {
            run: () => true,
            update: 'second'
          },
          {
            run: () => {
              expect(wu.model.get('first')).toBe(true)
              expect(wu.model.get('second')).toBe(true)
              global.fetch.mockClear()
              done()
            }
          }
        ]
      }
    })
    wu.start()
  })

  test('Check response: should concat arguments and response body', (done) => {
    const responses = []
    common.mockFetch({
      onChange: 'app.ready',
      request: {
        path: 'https://server.com'
      },
      onResponse: {
        success: {
          args: 'data',
          run: (data, response) => {
            setTimeout(() => {
              expect(wu.model.get('data')).toBe('from-model from-server')
              global.fetch.mockClear()
              done()
            }, 10)
            return data + ' ' + response.body.data
          },
          update: 'data'
        }
      }
    }, '{"data":"from-server"}')
    wu.model.set('data', 'from-model')
    wu.start()
  })

})
