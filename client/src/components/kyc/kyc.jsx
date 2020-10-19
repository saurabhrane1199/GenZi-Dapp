import React, {Component} from 'react';
import './kyc.styles.scss'
import PersonIcon from '@material-ui/icons/Person';
import ShortTextIcon from '@material-ui/icons/ShortText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Link} from 'react-router-dom';
import {updateUserProfileDocument}  from '../../firebase/firebase.utils.js'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {drizzleConnect} from '@drizzle/react-plugin';



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

  // componentDidMount(){
  //   console.log(this.props.drizzle,"Drizzle ar kyc")
  // }

  setValue = (aadhar,name,role) => {
    const contract = this.contracts.genz;
    const stackId = contract.methods["_register"].cacheSend(aadhar,name,role,{
      from : this.props.accounts[0]
    });
    this.setState({ stackId });
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
        <Link to="/db">About</Link>
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

export default drizzleConnect(KYC,mapStateToProps)