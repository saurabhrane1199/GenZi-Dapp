import React, {Component} from 'react';
import './kyc.styles.scss'
import PersonIcon from '@material-ui/icons/Person';
import ShortTextIcon from '@material-ui/icons/ShortText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types'
import {drizzleConnect} from '@drizzle/react-plugin';
import {withRouter} from 'react-router-dom'



class KYC extends Component {

  constructor(props,context) {
    super(props)
    this.state = {
      aadhar: '',
      role: '0',
      name: '',
      stackId : null
      // storageValue: 0,
      // web3: null,
      // accounts: null,
      // contract: null
    }
    this.contracts = context.drizzle.contracts
    this.initialized  = context.drizzle.initialized

  }

  componentDidMount(){
    this.contracts.genz.methods.login()
            .call()
            .then(res => {
              if(res==='1'){
                this.contracts.genz.methods.getDetails()
                    .call()
                    .then(res => {
                      let currentUser = this.createUser(res[0],res[1],res[2])
                      this.redirectLogin(currentUser)
                    }
                    
                    )

              }
              else{
                console.log("Eh do kyc first")
              }
            })
    
    
    
  }

  redirectLogin(currentUser){
    if(currentUser['role']==0){
      this.props.history.push('/fdb',
        {currentUser : currentUser}
      
      )
    }
    else{
      this.props.history.push('/idb',
      {currentUser : currentUser}
      )
    }
  }

  createUser(aadhar,name,role){
    const currentUser = {
      aadhar,
      name,
      role,
    }
    return currentUser

  }

  setValue = (aadhar,name,role) => {
    this.contracts.genz.methods._register(aadhar,name,role).send({
      from : this.props.accounts[0]
    }).then(res=>{
      let currentUser = this.createUser(aadhar,name,role)
      this.redirectLogin(currentUser)
    })
    
  }


  handleOnChangeAadhar = (e) => {
    this.setState({
      aadhar: Number(e.target.value),
    });
  };

  handleOnChangeRole = (e) => {
    this.setState({
      role: e.target.value,
    });
  };

  handleOnChangeName = (e) => {
    this.setState({
      name: e.target.value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const data = {
      aadhar: this.state.aadhar,
      name: this.state.name,
      role: Number(this.state.role),
    };
    this.setValue(data['aadhar'], data['name'], data['role'])
  }

  render() {
    return (
      <div className="wrapper">
        <h2 style={{ color: "white", textAlign: "center", margin: "10px 20px" }}>Please enter your details so we can know you better</h2><br />
        <form onSubmit={this.onSubmit} className="form login">
          <div className=" form__field">
            <label for="aadhar_no"><PersonIcon /></label>
            <input id="aadhar_no" type="numeric" name="aadhar" onChange={this.handleOnChangeAadhar} className="form__input" placeholder="Username" required />
          </div>

          <div className="form__field">
            <label for="name"><ShortTextIcon /></label>
            <input id="name" type="text" name="name" className="form__input" onChange={this.handleOnChangeName} placeholder="Name" required />
          </div>

          <div
            style={{ marginLeft: "10px" }}>
            <RadioGroup style={{ backgroundColor: "none" }} aria-label="gender" name="gender1" value={this.state.role} onChange={this.handleOnChangeRole}>
              <FormControlLabel value="0" control={<Radio />} label="Farmer" />
              <FormControlLabel value="1" control={<Radio />} label="Investor" />
            </RadioGroup>
          </div>

          <div className="form__field" style={{ alignItems: "center", margin: "50px" }}>
            <input type="submit" style={{ width: "40%", margin: "0 auto" }} value="Submit" />

          </div>
        </form>
      </div>

    )
  }
}


KYC.contextTypes ={
  drizzle : PropTypes.object
}

const mapStateToProps = (state) => ({
  accounts : state.accounts,
})

export default withRouter(drizzleConnect(KYC,mapStateToProps))