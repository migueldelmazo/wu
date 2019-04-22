import _ from 'lodash'

const wu = {
  _private: {
    items: {}
  }
}

// run function

const runFn = (definition, ...fnArgs) => {
  let modelArgs = definition.args ? wu.model.populate(definition.args) : []
  modelArgs = _.parseArray(modelArgs)
  return _.isFunction(definition.run) ? definition.run(...modelArgs, ...fnArgs) : modelArgs[0]
}

// set in model

const setInModel = (definition, value) => {
  wu.model.set(definition.to, value)
}

export { wu, runFn, setInModel }

window.wu = wu
