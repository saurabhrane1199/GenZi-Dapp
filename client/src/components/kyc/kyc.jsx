import React, { Component, useState } from 'react';
import getWeb3 from "../../getWeb3.js";
import { withRouter } from 'react-router-dom';
// import KycContract from "../contracts/kyc.json";
// import KycContract from '../../contracts/kyc.json'
import GenZContract from '../../contracts/genz.json';
import './kyc.styles.scss'
import PersonIcon from '@material-ui/icons/Person';
import ShortTextIcon from '@material-ui/icons/ShortText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';




class KYC extends Component {

  constructor(props) {
    super(props)
    this.state = {
      aadhar: '',
      role: '0',
      name: '',
      storageValue: 0,
      web3: null,
      accounts: null,
      contract: null
    }

  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = GenZContract.networks[networkId];
      const instance = new web3.eth.Contract(
        GenZContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  runExample = async (aadhar, name, role) => {
    const { accounts, contract } = this.state;
    const {history} =  this.props
    await contract.methods._register(aadhar, name, role).send({ from: accounts[0] });
    const response = await contract.methods.getDetails().call();
    this.setState({ storageValue: response },() => {
      console.log(response)});
      history.push('/createPolicy')
  };


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
    this.runExample(data['aadhar'], data['name'], data['role'])
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
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




export default withRouter(KYC)