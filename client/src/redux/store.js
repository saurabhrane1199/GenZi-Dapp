import {createStore,applyMiddleware,compose} from 'redux';
// import {browserHistory} from 'react-router';
import logger from 'redux-logger';
import rootReducer from './root-reducer';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import rootSaga from './rootSaga'
import createSagaMiddleware from 'redux-saga'
import { generateContractsInitialState } from '@drizzle/store'
import drizzleOptions from './drizzleOptions'
import { createBrowserHistory } from 'history';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const history = createBrowserHistory()

const routingMiddleware = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();

const initialState = {
    contracts: generateContractsInitialState(drizzleOptions)
  };


const middlewares = [logger, thunkMiddleware, routingMiddleware, sagaMiddleware];

const store = createStore(
                rootReducer,
                initialState,
                composeEnhancers(
                applyMiddleware(...middlewares))
                );


sagaMiddleware.run(rootSaga)   

export {history}
export {store}

export default store;



