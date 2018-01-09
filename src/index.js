import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

import App from './components/App'
import reducer from './reducers'
import { getAccounts } from './actions'

const loggerMiddleware = createLogger()

const store = createStore(
  reducer,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
);

store.dispatch(getAccounts());

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
