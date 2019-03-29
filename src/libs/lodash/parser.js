import _ from 'lodash'

_.mixin({

  parseCamelCaseDeep: (data) => {
    return _.mapDeep(data, _.camelCase)
  },

  parseArray: (arr) => {
    return _.isArray(arr) ? arr : [arr]
  },

  parseDeepValues: (value, parser) => {
    if (_.isNumber(value) || _.isString(value) || _.isBoolean(value)) {
      return parser(value)
    } else if (_.isFunction(value)) {
      return value()
    } else if (_.isArray(value)) {
      return _.map(value, (item) => {
        return _.parseDeepValues(item, parser)
      })
    } else {
      return _.reduce(value, (result, objectValue, objectKey) => {
        result[objectKey] = _.parseDeepValues(objectValue, parser)
        return result
      }, {})
    }
  }

})
