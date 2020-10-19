import {combineReducers} from 'redux';
import userReducer from './reducers/user.reducer';
import {drizzleReducers} from '@drizzle/store'
import {routerReducer} from 'react-router-redux';

const rootReducer = combineReducers({
    user : userReducer,
    routing : routerReducer,
    ...drizzleReducers
});

export default rootReducer;