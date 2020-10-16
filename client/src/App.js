import React, { Component } from "react";
import SignInSignUpPage from './pages/onboarding/signInsignUp'
import { Route, Switch, Redirect } from 'react-router-dom'
import CreatePolicy from './components/policy_creation/policy_new'
import MyContracts from './components/mycontracts/mycontracts'
import KYC from './components/kyc/kyc'
import "./App.css";
// import { Switch } from "@material-ui/core";

import {setCurrentUser} from './redux/user/user.actions'
import {auth, createUserProfileDocument} from './firebase/firebase.utils.js';
import FarmerDashboard from './pages/FarmerDashboard/farmerDashBoard.jsx'

import {connect} from 'react-redux'


const renderForwarding = (currentUser) => {
    if(currentUser==null){

    }else if(!currentUser.kyc){

    }
    else{

    }
}


class App extends Component {

  unsubscribeFromAuth = null

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      drizzleState: null
    };
  }

  componentDidMount() {
    const { drizzle } = this.props
    const {setCurrentUser} = this.props
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

    this.unsubscribe = drizzle.store.subscribe(() => {
      const drizzleState = drizzle.store.getState();
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }

    })
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
        // <Switch>
        //   <Route path='/' exact/>
        //   <Route path='/signin' exact component={SignInSignUpPage}/>
        //   <Route 
        //       path='/kyc' exact 
        //       render={() => this.props.currentUser ? 
              
        //       <KYC
        //       drizzle = {this.props.drizzle}
        //       drizzleState = {this.state.drizzleState}/> : <Redirect to='/signin'/> }
        //   />


        // </Switch>
        
        
        
        
        
        
        
        <Switch>          
          <Route path='/db' exact
          render={ () => 
            <FarmerDashboard
              drizzle = {this.props.drizzle}
              drizzleState = {this.state.drizzleState}/>
            }/>



          {/* <Route path='/signin' exact component={ () => <SignInSignUpPage />} /> */}  
          {/* <Route path='/' exact component={MyContracts}/> */}
          
          {/* <Route 
              path='/kyc' exact 
              render={() => this.props.currentUser ? 
              
              <KYC
              drizzle = {this.props.drizzle}
              drizzleState = {this.state.drizzleState}/>: <Redirect to='/signin'/> }
          /> */}

          <Route 
              path='/' exact 
              render={() =>  
              
              <KYC
              drizzle = {this.props.drizzle}
              drizzleState = {this.state.drizzleState}/> }
          />
          
          <Route exact path='/signin' render={
            () => this.props.currentUser ? 
                      (<Redirect to='/'/>)
                        : (<SignInSignUpPage/>)
                    
                    }/>
          
          
          <Route path='/createPolicy' exact component={CreatePolicy} />
        </Switch>
      )

    }}
}


const mapStateToProps = ({user}) => ({
  currentUser : user.currentUser,
})

const mapDispatchToPros = dispatch => ({
setCurrentUser : user => dispatch(setCurrentUser(user))
})
export default connect(mapStateToProps,mapDispatchToPros)(App);

// export default App;
