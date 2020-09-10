import React, {Component} from 'react';
import getWeb3 from "../../getWeb3.js";
// import KycContract from "../contracts/kyc.json";
import KycContract from '../../contracts/kyc.json'

class KYC extends Component{

    constructor(props){
        super(props)
        this.state = {
            aadhar : '',
            role : '',
            name : '',
            storageValue: 0,
            web3: null,
            accounts: null,
            contract: null
        }
        
    }

    componentDidMount = async () => {
        try {
          // Get network provider and web3 instance.
          const web3 = await getWeb3();
    
          // Use web3 to get the user's accounts.
          const accounts = await web3.eth.getAccounts();
    
          // Get the contract instance.
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = KycContract.networks[networkId];
          const instance = new web3.eth.Contract(
            KycContract.abi,
            deployedNetwork && deployedNetwork.address,
          );
    
          // Set web3, accounts, and contract to the state, and then proceed with an
          // example of interacting with the contract's methods.
          this.setState({ web3, accounts, contract: instance },this.runExample);
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
      };


      runExample = async () => {
        const { accounts, contract } = this.state;
        const aadhar = 78555548484
        const name = "zucc"
        const role = 1

    
        // Stores a given value, 5 by default.
        await contract.methods._register(aadhar,name,role).send({ from: accounts[0] });
    
        // Get the value from the contract to prove it worked.
        const response = await contract.methods.getDetails().call();
    
        // Update state with the result.
        this.setState({ storageValue: response },()=>console.log(response));
      };


    handleOnChangeAadhar = (e) => {
        this.setState({
          aadhar: e.target.value,
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
          username: this.state.username,
          password: this.state.password,
        };
      }

    render(){
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
          <div className="container">
            <div className="kyc-container row" >
              <div className="col-md-6">
                
              </div>
              <div>
              <body className="align">
		              <div className="grid">
			                <form onSubmit={handleSubmit} className="form login">
				              <div className="form__field">
					                <label for="aadhar__no"><svg className="icon"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#user"></use></svg><span className="hidden">Enter Your Aadhar Number</span></label>
					                <input id="aadhar__no" type="number" name="aadhar" className="form__input" placeholder="XXXXXXX" required />
				              </div>

				              <div className="form__field">
					                <label for="user_name"><svg className="icon"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#lock"></use></svg><span className="hidden">Enter your Name</span></label>
					                <input id="user_name" type="password" name="password" className="form__input" required />
				              </div>

				              <div className="form__field">
					              <input type="submit" value="Sign In" />
              				</div>
			                </form>
			                <p className="text--center">Not a member? <a href="#">Sign up now</a> <svg className="icon"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="assets/images/icons.svg#arrow-right"></use></svg></p>
		                </div>
		                <svg xmlns="http://www.w3.org/2000/svg" className="icons"><symbol id="arrow-right" viewBox="0 0 1792 1792"><path d="M1600 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293H245q-52 0-84.5-37.5T128 1024V896q0-53 32.5-90.5T245 768h704L656 474q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z" /></symbol><symbol id="lock" viewBox="0 0 1792 1792"><path d="M640 768h512V576q0-106-75-181t-181-75-181 75-75 181v192zm832 96v576q0 40-28 68t-68 28H416q-40 0-68-28t-28-68V864q0-40 28-68t68-28h32V576q0-184 132-316t316-132 316 132 132 316v192h32q40 0 68 28t28 68z" /></symbol><symbol id="user" viewBox="0 0 1792 1792"><path d="M1600 1405q0 120-73 189.5t-194 69.5H459q-121 0-194-69.5T192 1405q0-53 3.5-103.5t14-109T236 1084t43-97.5 62-81 85.5-53.5T538 832q9 0 42 21.5t74.5 48 108 48T896 971t133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5T896 896 624.5 783.5 512 512t112.5-271.5T896 128t271.5 112.5T1280 512z" /></symbol></svg>
	              </body>
              </div>
            </div>
          </div>
        )}
}




export default KYC