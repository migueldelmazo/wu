import wu from '../index'
import common from './common'

describe('Check wu.create("api") method', () => {

  beforeEach(wu.reset)
  
  test('Check flags: should set ok flags', (done) => {
    common.mockFetch({
      onChange: 'app.ready',
      request: {
        path: 'https://server.com'
      },
      onResponse: {
        complete: {
          run: (response, request) => {
            expect(wu.model.get('sending')).toBe(true)
            expect(wu.model.get('error')).toBe(false)
            expect(wu.model.get('ok')).toBe(false)
            expect(wu.model.get('complete')).toBe(false)
            expect(wu.model.get('status')).toBe('')
            setTimeout(() => {
              expect(wu.model.get('sending')).toBe(false)
              expect(wu.model.get('error')).toBe(false)
              expect(wu.model.get('ok')).toBe(true)
              expect(wu.model.get('complete')).toBe(true)
              expect(wu.model.get('status')).toBe(200)
              global.fetch.mockClear()
              done()
            }, 10)
          }
        }
      },
      options: {
        flags: {
          sending: 'sending',
          error: 'error',
          ok: 'ok',
          complete: 'complete',
          status: 'status'
        }
      }
    })
    wu.start()
  })
  
  test('Check flags: should set error flags', (done) => {
    common.mockFetch({
      onChange: 'app.ready',
      request: {
        path: 'https://server.com'
      },
      onResponse: {
        complete: {
          run: (response, request) => {
            expect(wu.model.get('sending')).toBe(true)
            expect(wu.model.get('error')).toBe(false)
            expect(wu.model.get('ok')).toBe(false)
            expect(wu.model.get('complete')).toBe(false)
            expect(wu.model.get('status')).toBe('')
            setTimeout(() => {
              expect(wu.model.get('sending')).toBe(false)
              expect(wu.model.get('error')).toBe(true)
              expect(wu.model.get('ok')).toBe(false)
              expect(wu.model.get('complete')).toBe(true)
              expect(wu.model.get('status')).toBe(404)
              global.fetch.mockClear()
              done()
            }, 10)
          }
        }
      },
      options: {
        flags: {
          sending: 'sending',
          error: 'error',
          ok: 'ok',
          complete: 'complete',
          status: 'status'
        }
      }
    }, 'error response', {}, 404)
    wu.start()
  })
    
})
