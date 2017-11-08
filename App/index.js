import React from 'react'
import ReactDOM from 'react-dom'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createBrowserHistory } from 'history'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import { App } from 'containers'
import * as reducers from 'redux/modules'
import { checkIfAuthed } from 'helpers/auth'

const composeEnhancers = composeWithDevTools({})

const history = createBrowserHistory()

const store = createStore(
  combineReducers(
    { ...reducers,
      routing: routerReducer,
    }
  ),
  composeEnhancers(
    applyMiddleware(thunk, routerMiddleware(history))
  )
)

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('app')
)
