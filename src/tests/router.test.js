import _ from 'lodash'
import wu from '../index'

describe('Check wu.create("router") method', () => {

  beforeEach(wu.reset)

  test('Check active router without params: should be active', (done) => {
    wu.create('router', 'router-name', {
      urlPattern: '/user',
      update: 'router.user'
    })
    wu.start()
    _.navigate('/user')
    setTimeout(() => {
      expect(wu.model.get('app.router.notFound')).toBe(false)
      expect(wu.model.get('router.user.isActive')).toBe(true)
      expect(wu.model.get('router.user.params')).toEqual({})
      done()
    }, 10)
  })

  test('Check active router with params: params should be full', (done) => {
    wu.create('router', 'router-name', {
      urlPattern: '/user/:userId',
      update: 'router.user'
    })
    wu.start()
    _.navigate('/user/123')
    setTimeout(() => {
      expect(wu.model.get('app.router.notFound')).toBe(false)
      expect(wu.model.get('router.user.isActive')).toBe(true)
      expect(wu.model.get('router.user.params')).toStrictEqual({
        userId: '123'
      })
      done()
    }, 10)
  })

  test('Check not found routes: app.router.notFound should be true', (done) => {
    wu.create('router', 'router-name', {
      urlPattern: '/user',
      update: 'router.user'
    })
    wu.start()
    _.navigate('/user-not-found')
    setTimeout(() => {
      expect(wu.model.get('app.router.notFound')).toBe(true)
      done()
    }, 10)
  })

  test('Check app.router.location: should have good values', (done) => {
    wu.start()
    _.navigate('/user?one=1&two=2#hash')
    setTimeout(() => {
      expect(wu.model.get('app.router.location')).toStrictEqual({
        hash: 'hash',
        host: 'localhost',
        hostname: 'localhost',
        pathname: '/user',
        port: '',
        protocol: 'http:',
        queryParams: {
          one: '1',
          two: '2'
        },
        url: 'http://localhost/user?one=1&two=2#hash'
      })
      done()
    }, 10)
  })

  test('Check invalid router properties: should log an error', () => {
    _.logError = (...args) => {
    }
    const spy = jest.spyOn(_, 'logError')
    wu.create('router', 'router-name', {})
    wu.create('router', 'router-name', {
      urlPattern: null
    })
    wu.create('router', 'router-name', {
      urlPattern: 'url',
      update: ''
    })
    expect(spy).toHaveBeenCalledTimes(2)
  })

})
