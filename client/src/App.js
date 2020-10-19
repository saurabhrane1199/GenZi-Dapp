import React, { Component } from "react";
import SignIn from './components/signIn/signin'
import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom'
import InvestorDashboard from './pages/InvestorDashboard/investorDashboard'
import KYC from './components/kyc/kyc'
import "./App.css";


import { drizzleConnect } from 'drizzle-react';
import { setCurrentUser } from './redux/actions/actions'
import { auth, createUserProfileDocument } from './firebase/firebase.utils.js';
import FarmerDashboard from './pages/FarmerDashboard/farmerDashBoard.jsx'
import { connect } from 'react-redux'
import drizzle from "drizzle";


class App extends Component {

  unsubscribeFromAuth = null

  constructor(props) {
    super(props)
  }

  componentDidMount() {

    const { setCurrentUser } = this.props


    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot(snapShot => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data()
          });
        });
      }

      setCurrentUser(userAuth);
    });




  }



  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <Router>
        <Switch>

          <Route path='/' exact
            render={() => true ? <Redirect to='/db' /> : <Redirect to='/signin' />}

          />

          <Route
            path='/fdb' exact
            render={() =>
              <FarmerDashboard />} />


          <Route
            path='/idb' exact
              render={()=>
              <InvestorDashboard/>}/>



          <Route path='/signin' exact component={SignIn} />

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


const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
})

const mapDispatchToPros = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(mapStateToProps, mapDispatchToPros)(App);

// export default App;
