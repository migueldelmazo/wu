import _ from 'lodash'

const wu = {
  _private: {
    items: {}
  }
}

// run function

const runFn = (definition, ...fnArgs) => {
  if (_.isPlainObject(definition)) {
    const modelArgs = definition.args ? wu.model.populate(definition.args) : []
    const args = [].concat(_.parseArray(modelArgs)).concat(fnArgs)
    return _.isFunction(definition.run) ? definition.run(...args) : args[0]
  } else {
    return definition
  }
}

// set in model

const setInModel = (definition, value) => {
  wu.model.set(definition.update, value)
}

export { wu, runFn, setInModel }

window.wu = wu
