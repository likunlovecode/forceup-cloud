import React, { Component } from 'react';
import { Provider } from 'react-redux'
import {
    createStore,
    applyMiddleware,
    compose,
} from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './rootReducer'
import Routes from './routes'
import history from './history'
import { Router } from 'react-router-dom'
import SubLayout from './SubLayout'

let redux_tool_obj = typeof (window.__REDUX_DEVTOOLS_EXTENSION__) === 'undefined' ? applyMiddleware(thunk) : compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__())
const store = createStore(rootReducer, redux_tool_obj)
window.reduxStore = store
class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router history={history}>
                    <SubLayout routes={Routes} />
                </Router>
            </Provider>
        );
    }
}

export default App;
