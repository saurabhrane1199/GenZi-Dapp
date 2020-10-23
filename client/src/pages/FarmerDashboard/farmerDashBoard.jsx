import React, {Component} from 'react';
import './farmer-dashboard.styles.scss'
import CreatePolicy from '../../components/policy_creation/policy_new'
import { Link } from 'react-router-dom';
import MyContracts from '../../components/mycontracts/mycontracts'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'


const  ConditionalRendering =  ({title, navigateToContracts}) => {
  if(title === 'contracts'){
    return <MyContracts/>
  }
  else{
    return <CreatePolicy navigateToContracts={navigateToContracts}/>
  }
}

class FarmerDashboard extends Component{

  constructor(props,context){
    super(props)
    this.state = {
      key : 'contracts',
      balance : 0
    }
    // this.currentUser = null
    
    if(!this.props.location.state){
      this.props.history.push('/kyc')
    }
    else if(this.currentUser && this.currentUser.role == 1){
      this.props.history.push('/idb',
      {currentUser : this.currentUser}
      )
    }
    else{
      this.currentUser = this.props.location.state.currentUser 
    }
    this.contracts = context.drizzle.contracts

  }

  componentDidMount(){
    console.log(this.props.location.state)
    this.contracts.genz.methods.getBalanceUser()
            .call()
            .then(res => this.setState({balance:res}))
  }

  componentDidUpdate(){
    // console.log(this.props.location.state)
    this.contracts.genz.methods.getBalanceUser()
            .call()
            .then(res => this.setState({balance:res}))
  }

  navigateToContracts = () =>{
    this.setState({key:'contracts'});
  }

  render(){
    return (
      <div className="site-wrap">
        <nav className="site-nav">
          <div className="name">
            {this.currentUser ? this.currentUser.name : "Not_Found"}
        <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M11.5,22C11.64,22 11.77,22 11.9,21.96C12.55,21.82 13.09,21.38 13.34,20.78C13.44,20.54 13.5,20.27 13.5,20H9.5A2,2 0 0,0 11.5,22M18,10.5C18,7.43 15.86,4.86 13,4.18V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V4.18C7.13,4.86 5,7.43 5,10.5V16L3,18V19H20V18L18,16M19.97,10H21.97C21.82,6.79 20.24,3.97 17.85,2.15L16.42,3.58C18.46,5 19.82,7.35 19.97,10M6.58,3.58L5.15,2.15C2.76,3.97 1.18,6.79 1,10H3C3.18,7.35 4.54,5 6.58,3.58Z"></path>
            </svg>
          </div>
  
          <div className="note">
            <h3>Your Balance</h3>
            {
              this.state.balance >= 0 ? 
              (<p style={{fontSize:"20px",fontWeight:"bold",color:`#80ff80`}}>
              <span><i className="fa fa-rupee"></i></span>&nbsp;{Math.abs(this.state.balance)}</p>) 
              :
              <p style={{fontSize:"20px",fontWeight:"bold",color:`#ff8566`}}>
              -<span><i className="fa fa-rupee"></i></span>&nbsp;{Math.abs(this.state.balance)}</p>
            }
          </div>





        </nav>
        <main>
          <header>
            <div className="breadcrumbs">
              <Link to="/">Home</Link>
            </div>
            <h1 className="title">Pipeline</h1>
            <nav className="nav-tabs" id="nav-tabs">
              <Link onClick={() => this.setState({key:'contracts'})} className={this.state.key==='contracts' ? "active": ""}>
                Contracts
                <span>14</span>
              </Link>
              <Link onClick={() => this.setState({key:'createPolicy'})}  className={this.state.key==='createPolicy' ? "active": ""}>
                Create Policy
                <span>24</span>
              </Link>
            </nav>
          </header>
          <div className="content-columns">
              <ConditionalRendering title={this.state.key} navigateToContracts={this.navigateToContracts}/>
          </div>
        </main>
      </div>)
    
  }
}


FarmerDashboard.contextTypes ={
  drizzle : PropTypes.object
}


export default withRouter(FarmerDashboard)