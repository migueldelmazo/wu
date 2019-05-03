import wu from '../index'

const data = {
  boolean01: true,
  float01: 1.1,
  integer01: 1,
  string01: 'string 01',
  object01: {
    boolean02: true,
    string02: 'string 02'
  },
  array01: [1, 2, 3]
}

describe('Check wu.model.populate() method', () => {

  beforeEach(wu.reset)

  test('Check primitive integer: should return the same value', () => {
    wu.model.set('data', data)
    expect(wu.model.populate(1)).toBe(1)
  })

  test('Check primitive boolean: should return the same value', () => {
    wu.model.set('data', data)
    expect(wu.model.populate(true)).toBe(true)
  })

  test('Check array: should return an array with populated values', () => {
    wu.model.set('data', data)
    expect(wu.model.populate([
      'data.boolean01',
      'data.float01',
      'data.integer01',
      'data.string01',
      'data.object01',
      'data.array01'
    ]))
      .toStrictEqual([
        true,
        1.1,
        1,
        'string 01',
        {
          boolean02: true,
          string02: 'string 02'
        },
        [1, 2, 3]
      ])
  })

  test('Check object: should return an object with populated values', () => {
    wu.model.set('data', data)
    expect(wu.model.populate({
      newBoolean: 'data.boolean01',
      newFloat: 'data.float01',
      newInteger: 'data.integer01',
      newString: 'data.string01',
      newObject: 'data.object01',
      newArray: 'data.array01'
    }))
      .toStrictEqual({
        newBoolean: true,
        newFloat: 1.1,
        newInteger: 1,
        newString: 'string 01',
        newObject: {
          boolean02: true,
          string02: 'string 02'
        },
        newArray: [1, 2, 3]
      })
  })

  test('Check string with #: should not populate strings that start with #', () => {
    wu.model.set('data', data)
    expect(wu.model.populate({
      parsedString: 'data.string01',
      notParsedString: '#data.object01',
    }))
      .toStrictEqual({
        parsedString: 'string 01',
        notParsedString: 'data.object01',
      })
  })

  test('Check empty string: should return an empty string', () => {
    wu.model.set('data', data)
    expect(wu.model.populate({
      parsedString: 'data.string01',
      emptyString: '',
    }))
      .toStrictEqual({
        parsedString: 'string 01',
        emptyString: '',
      })
  })

  test('Check nested object: should return the same cloned object', () => {
    wu.model.set('data', data)
    const newData = wu.model.populate({
      newObject: 'data.object01'
    })
    expect(data.object01).toStrictEqual(newData.newObject)
    expect(data.object01 === newData.newObject).toBe(false)
  })

})
