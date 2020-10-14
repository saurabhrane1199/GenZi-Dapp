import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom'

import {Drizzle, generateStore} from '@drizzle/store'
import GenZContract from './contracts/genz.json';
import store from './redux/store'
import {Provider} from 'react-redux';

const options = {
  contracts : [GenZContract]
};

const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);

ReactDOM.render(
    <Provider store={store}>
    <BrowserRouter>
        <App drizzle={drizzle}/>
    </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
