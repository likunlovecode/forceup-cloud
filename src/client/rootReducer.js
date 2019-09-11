import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import commonReducer from '$common/reducers/index'

const context = require.context('$modules', true, /\/*\/reducers\/index\.js$/)
const keys = context.keys() || []

const reducers = {}

for (let i = 0; i < keys.length; i++) {
    let exp = context(keys[i])
    for (let fn in exp) {
        reducers[fn] = exp[fn]
    }
}
const rootReducer = combineReducers({
    router: routerReducer,
    common: commonReducer,
    ...reducers,
})

export default rootReducer 