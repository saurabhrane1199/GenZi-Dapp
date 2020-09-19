import React, { Component } from 'react'
import getWeb3 from "../../getWeb3.js";
// import './policy.styles.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form, InputGroup, FormControl, Button} from 'react-bootstrap';
import GenZContract from '../../contracts/genz.json';



class CreatePolicy extends Component {
    constructor(props) {
        super(props)
        this.state = {
            area : 0,
            location : 'Mumbai',
            forFlood : true,
            cropId : 0,
            duration : 0,
            web3: null,
            accounts: null,
            contract: null
        }
    }

    handleOnChangeArea = (e) => {
        this.setState({
            area : Number(e.target.value)
        })

    }

    handleOnChangeLocation = (e) => {
        this.setState({
            location : e.target.value
        })
    }

    handleOnChangeFlood = (e) => {
        const flag = false
        const value = e.target.value
        if(value==="Flood"){
            flag=true
        }else{
            flag=false
        }

        this.setState({
            forFlood:flag
        })
    }

    handleOnChangeCropId = (e) => {
        this.setState({
            cropId : Number(e.target.value)
        })
    }

    handleOnChangeDuration = (e) => {
        this.setState({
            duration : Number(e.target.value)
        })
    }

    handleOnSubmit = (e) => {
        e.preventDefault();
        this.run()

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
            console.log(this.state.contract)
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
      };

    run = async () => {
        const { accounts, contract } = this.state
        console.log(`Your Account : ${accounts} COntract: ${contract}`)
        const {area,location,forFlood,cropId,duration} = this.state
        await contract.methods.newPolicy(area ,location ,forFlood , cropId, duration).send({ from: accounts[0], value:100})
            .then(res => console.log(`Success ${res}`))
            .catch(err => console.log(err))
        const response = await contract.methods.getPolicyDetails(0).call();
        this.setState({ storageValue: response },() => {alert(response)});
      };

    // int:area str:location bool:forFlood int:cropId int:Duration

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
          }
        return (
            <div className="Wrapper" style={{width:"50%", margin:"0 auto"}}>
                    <Form onSubmit={this.handleOnSubmit}>
                        <Form.Group style={{width:"50%"}} controlId="farm_area">
                            <Form.Label>Enter the Area of Your Farm</Form.Label>
                            <InputGroup className="mb-3">
                            <FormControl id="inlineFormInputGroupUsername2" type="number" placeholder="8855" aria-describedby="sqkms" onChange={this.handleOnChangeArea}/>
                                <InputGroup.Append>
                                    <InputGroup.Text id="=sqkms">sqKms</InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group controlId="farm_location">
                            <Form.Label>Please Enter the Location of Your Farm</Form.Label>
                            <Form.Control type="text" placeholder="Sangli" onChange={this.handleOnChangeLocation} />
                        </Form.Group>

                        <Form.Group controlId="protection">
                            <Form.Label>Insurance against</Form.Label>
                            <Form.Control as="select" onChange={this.handleOnChangeFlood}>
                            <option value="Flood">Flood</option>
                            <option value="Drought">Drought</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="crop_id">
                            <Form.Label>Please Enter the CropId</Form.Label>
                            <Form.Control type="number" placeholder="8" onChange={this.handleOnChangeCropId}/>
                        </Form.Group>

                        <Form.Group style={{width:"50%"}} controlId="duration">
                            <Form.Label>Enter the Duration of your Policy</Form.Label>
                            <InputGroup className="mb-3">
                            <FormControl id="duration" type="number" placeholder="12" aria-describedby="months" onChange={this.handleOnChangeDuration} />
                                <InputGroup.Append>
                                    <InputGroup.Text id="=months">Months</InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>

                        

                        <Button variant="primary" type="submit">Submit</Button>
                    </Form>

                </div>
        
        )
    }



}


export default CreatePolicy