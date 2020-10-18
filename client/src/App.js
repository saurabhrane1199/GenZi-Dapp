import React, { Component } from "react";
import SignIn from './components/signIn/signin'
import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom'
import KYC from './components/kyc/kyc'
import "./App.css";
// import { Switch } from "@material-ui/core";

import { setCurrentUser } from './redux/user/user.actions'
import { auth, createUserProfileDocument } from './firebase/firebase.utils.js';
import FarmerDashboard from './pages/FarmerDashboard/farmerDashBoard.jsx'
import { connect } from 'react-redux'


class App extends Component {

  unsubscribeFromAuth = null

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      drizzleState: null,
      currentUser : null
    };
  }

  componentDidMount() {
    const { drizzle } = this.props
    const { setCurrentUser } = this.props
    console.log(drizzle)

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

    this.unsubscribe = drizzle.store.subscribe(async () => {
      const drizzleState = drizzle.store.getState();
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }

    });

    
  }



  componentWillUnmount() {
    this.unsubscribe();
    this.unsubscribeFromAuth();
  }

  render() {
    if (this.state.loading) {
      return <p>Loading...</p>
    }
    else {
      return (
        <Router>
          <Switch>

            <Route path='/' exact
              render={() => this.state.currentUser ? <Redirect to='/db' /> : <Redirect to='/signin' />}

            />

            <Route
              path='/db' exact
              component={() =>
                <FarmerDashboard
                  drizzle={this.props.drizzle}
                  drizzleState={this.state.drizzleState} />} />




            <Route path='/signin' exact component={SignIn} />

            <Route
              path='/kyc' exact
              render={() =>
                <KYC
                  drizzle={this.props.drizzle}
                  drizzleState={this.state.drizzleState} />}
            />


          </Switch>
        </Router>
      )

    }
  }
}


const mapStateToProps = ({user}) => ({
  currentUser: user.currentUser,
})

const mapDispatchToPros = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})
export default connect(mapStateToProps, mapDispatchToPros)(App);

// export default App;
