import React, { Component } from "react";
import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom'
import InvestorDashboard from './pages/InvestorDashboard/investorDashboard'
import KYC from './components/kyc/kyc'
import "./App.css";
import FarmerDashboard from './pages/FarmerDashboard/farmerDashBoard.jsx'



class App extends Component {

  render() {
    return (
      <Router>
        <Switch>

          <Route path='/' exact
            render={() => <Redirect to='/kyc' />}

          />

          <Route
            path='/fdb' exact
            render={(props) =>
              <FarmerDashboard {...props} />} />


          <Route
            path='/idb' exact
              render={(props)=>
              <InvestorDashboard {...props}/>}/>

          <Route
            path='/kyc' exact
            render={() =>
              <KYC/>}
          />


        </Switch>
      </Router>
    )

  }
}


export default App;
