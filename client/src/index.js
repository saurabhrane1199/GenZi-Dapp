import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { syncHistoryWithStore } from 'react-router-redux'
import { DrizzleProvider } from 'drizzle-react'
import { LoadingContainer } from 'drizzle-react-components';
import GenZContract from './contracts/genz.json';
import store from './redux/store'
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';

const options = {
  contracts: [GenZContract],
  
};

const history = syncHistoryWithStore(createBrowserHistory(), store)



ReactDOM.render(
  <DrizzleProvider options={options}>
    <Provider store={store}>
      <LoadingContainer>
        <BrowserRouter history={history}>
          <App />
        </BrowserRouter>
      </LoadingContainer>
    </Provider>
  </DrizzleProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
