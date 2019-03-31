import _ from 'lodash'

_.mixin({

  mapDeep(data, keyMapper, valueMapper) {
    // iterate the array
    if (_.isArray(data)) {
      return _.map(data, (value, idx) => {
        return _.mapDeep(value, keyMapper, valueMapper)
      })
    } else
    // iterate the object
    if (_.isPlainObject(data)) {
      return _.reduce(data, (accumulator, value, key) => {
        key = _.isFunction(keyMapper) ? keyMapper(key) : key
        accumulator[key] = _.mapDeep(value, keyMapper, valueMapper)
        return accumulator
      }, {})
    } else
    // map the value
    {
      return _.isFunction(valueMapper) ? valueMapper(data) : data
    }
  },

  getObjectPaths(data, _info = [], _path = '', _pathPattern = '') {
    // iterate the array
    if (_.isArray(data)) {
      _.map(data, (value, idx) => {
        _.getObjectPaths(value, _info, _path + '.' + idx, _pathPattern + '[]')
      })
    } else

    // iterate the object
    if (_.isPlainObject(data)) {
      _.map(data, (value, key) => {
        _info.push({
          path: _.trimStart(_path + '.' + key, '.'),
          pattern: _.trimStart(_pathPattern + '.' + key, '.')
        })
        _.getObjectPaths(value, _info, _path + '.' + key, _pathPattern + '.' + key)
      })
    }
    return _info
  }

})
