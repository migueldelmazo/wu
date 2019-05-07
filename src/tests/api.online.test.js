import wu from '../index'
import common from './common'

describe('Check wu.create("api") method', () => {

  beforeEach(wu.reset)

  test('Check online: should be true by default', (done) => {
    wu.start()
    setTimeout(() => {
      expect(wu.model.get('api.online')).toBe(true)
      done()
    })
  })

})
