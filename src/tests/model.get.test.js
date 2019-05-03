import wu from '../index'

const data = {
  string01: 'an string'
}

describe('Check wu.model.get() method', () => {

  beforeEach(wu.reset)

  test('Get data: it must be possible to get the data', () => {
    wu.model.set('data', data)
    expect(wu.model.get('data')).toStrictEqual(data)
  })

  test('Get default data: should return default value', () => {
    expect(wu.model.get('non-existent-data', 'defaultValue')).toBe('defaultValue')
  })

  test('Get data: it must be possible to get the cloned data', () => {
    wu.model.set('data', data)
    expect(wu.model.get('data')).toStrictEqual(data)
    expect(wu.model.get('data') === data).toBe(false)
  })

})
