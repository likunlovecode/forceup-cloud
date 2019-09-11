import { combineReducers } from 'redux'

const context = require.context('./', true, /\.js$/)
const keys = context.keys().filter(item => item !== './index.js')
const reducers = {}

for (let i = 0; i < keys.length; i++) {
  let exp = context(keys[i])
  for (let fn in exp) {
    reducers[fn] = exp[fn]
  }
}
export function exampleReducer(state, action) {
  return combineReducers({
    ...reducers
  })(state, action)
}