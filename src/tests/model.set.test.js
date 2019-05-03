import wu from '../index'

const data = {
  string01: 'an string'
}

describe('Check wu.model.set() method', () => {

  beforeEach(wu.reset)

  test('Set data: it must be possible to get the data', () => {
    wu.model.set('data', data)
    expect(wu.model.get('data')).toStrictEqual(data)
  })

})
