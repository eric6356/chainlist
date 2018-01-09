import React from 'react'
import {render} from 'react-dom'
import {createStore, applyMiddleware, compose} from 'redux'
import {Provider} from 'react-redux'
import thunkMiddleware from 'redux-thunk'

import App from './components/App'
import reducer from './reducers'
import {getAccounts, initContract} from './actions'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunkMiddleware)));

store.dispatch(getAccounts());
store.dispatch(initContract());

render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);
