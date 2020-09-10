import React, { Component } from "react";
import SignInSignUpPage from './pages/onboarding/signInsignUp'
import {Route,BrowserRouter as Router,Link, Switch} from 'react-router-dom'
import HorizontalLinearStepper from './components/policy_creation/policy'
import KYC from './components/kyc/kyc'
import "./App.css";
// import { Switch } from "@material-ui/core";

class App extends Component {
  
  render() {
    return (
      // <SignInSignUpPage/>
      <Router>
        <Route path='/' exact component={SignInSignUpPage}/>
        <Route path='/createPolicy' exact component={HorizontalLinearStepper}/>
        <Route path='/kyc' exact component={KYC}/>
      </Router>
    );
  }
}

export default App;
