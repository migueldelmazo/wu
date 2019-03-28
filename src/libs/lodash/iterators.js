import _ from 'lodash'

_.mixin({

  mapDeep (data, keyMapper, valueMapper, _dotNotationPath = '', _dotNotationPathPattern = '') {
    // remove first dot in paths
    if (_dotNotationPath.charAt(0) === '.') {
      _dotNotationPath = _dotNotationPath.substr(1)
    }
    if (_dotNotationPathPattern.charAt(0) === '.') {
      _dotNotationPathPattern = _dotNotationPathPattern.substr(1)
    }
    
    // iterate the array
    if (_.isArray(data)) {
      return _.map(data, (value, idx) => {
        return _.mapDeep(value, keyMapper, valueMapper, _dotNotationPath + '.' + idx, _dotNotationPathPattern + '[]')
      })
    }
    
    // iterate the object
    if (_.isPlainObject(data)) {
      return _.reduce(data, (accumulator, value, key) => {
        const info = {
          path: _dotNotationPath + '.' + key,
          pattern: _dotNotationPathPattern + '.' + key
        }
        key = _.isFunction(keyMapper) ? keyMapper(key, info) : key
        accumulator[key] = _.mapDeep(value, keyMapper, valueMapper, _dotNotationPath + '.' + key, _dotNotationPathPattern + '.' + key)
        return accumulator
      }, {})
    }
    
    // map the value
    const info = {
      path: _dotNotationPath,
      pattern: _dotNotationPathPattern
    }
    return _.isFunction(valueMapper) ? valueMapper(data, info) : data
  }

})
