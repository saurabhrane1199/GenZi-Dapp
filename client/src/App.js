import React, { Component } from "react";
import SignInSignUpPage from './pages/onboarding/signInsignUp'
import {Route,BrowserRouter as Router,Link, Switch} from 'react-router-dom'
import CreatePolicy from './components/policy_creation/policy_new'
import KYC from './components/kyc/kyc'
import "./App.css";
// import { Switch } from "@material-ui/core";

class App extends Component {
  
  render() {
    return (
      // <SignInSignUpPage/>
      <Switch>
        <Route path='/' exact component={SignInSignUpPage}/>
        <Route path='/createPolicy' exact component={CreatePolicy}/>
        <Route path='/kyc' exact component={KYC}/>
      </Switch>
    );
  }
}

export default App;
