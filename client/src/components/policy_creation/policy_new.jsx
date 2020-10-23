import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import PropTypes from 'prop-types'
import {drizzleConnect} from '@drizzle/react-plugin';
import {withRouter} from 'react-router-dom';


class CreatePolicy extends Component {

    constructor(props,context) {
        super(props)
        this.state = {
            area: 0,
            location: 'Mumbai',
            forFlood: 1,
            cropId: 0,
            duration: 0,
            premium:0,
            coverage :0,
            stackId: null
        }
        this.mfP = {
            0 : 1,
            1 : 2
        }

        this.mfC = {
            0 : 7,
            1 : 10
        }

        this.contracts = context.drizzle.contracts

    }

    calcPremiumAmount(area, cropId){
        return area*this.mfP[cropId]
    }
    
    calcCoverageAmount(area, cropId){
        return area*this.mfC[cropId]

    }

    handleOnChangeArea = (e) => {
        const premium = this.calcPremiumAmount(e.target.value,this.state.cropId)
        const coverage = this.calcCoverageAmount(e.target.value,this.state.cropId)
        this.setState({
            area: Number(e.target.value),
            premium : premium,
            coverage : coverage
        })

    }

    handleOnChangeLocation = (e) => {
        this.setState({
            location: e.target.value
        })
    }

    // handleOnChangeFlood = (e) => {
    //     let flag = 1
    //     const value = e.target.value
    //     if (value === "Flood") {
    //         flag = 1
    //     } else {
    //         flag = 0
    //     }
    //     this.setState({
    //         forFlood: flag
    //     })
    // }

    handleOnChangeCropId = (e) => {
        const premium = this.calcPremiumAmount(this.state.area,e.target.value)
        const coverage = this.calcCoverageAmount(this.state.area,e.target.value)
        this.setState({
            cropId: Number(e.target.value),
            premium : premium,
            coverage : coverage
        })
    }

    handleOnChangeDuration = (e) => {
        this.setState({
            duration: Number(e.target.value)
        })
    }

    handleOnSubmit = (e) => {
        e.preventDefault();
        this.setValue()
        this.setState({
            area: 0,
            location: 'Mumbai',
            forFlood: 1,
            cropId: 0,
            duration: 0,
            premium:0,
            stackId: null
        })

    }

    handleReset = (e) => {
        this.setState({
            area: 0,
            location: 'Mumbai',
            forFlood: 1,
            cropId: 0,
            duration: 0,
            premium:0,
            stackId: null
        })

    }

    setValue = () => {
        const {area,location,forFlood,cropId,duration} = this.state
        this.contracts.genz.methods.newPolicy(area,forFlood,cropId,duration,location).send({
            from: this.props.accounts[0],
            value: (this.state.premium)
        })
        .then(()=>this.props.navigateToContracts())
        // .then(res => this.props.history.push('/kyc'));
        
    }

    // int:area str:location bool:forFlood int:cropId int:Duration

    render() {
        return (
            <div className="Wrapper" style={{ width: "50%", margin: "0 auto" }}>
                <Form onSubmit={this.handleOnSubmit} onReset={this.handleReset}>
                    <Form.Group style={{ width: "50%" }}>
                        <Form.Label>Enter the Area of Your Farm</Form.Label>
                        <InputGroup className="mb-3">
                            <FormControl id="inlineFormInputGroupUsername2" type="number" placeholder="8855" aria-describedby="sqkms" onChange={this.handleOnChangeArea} />
                            <InputGroup.Append>
                                <InputGroup.Text id="=sqkms">sqKms</InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Please Enter the Location of Your Farm</Form.Label>
                        <Form.Control type="text" placeholder="Sangli" onChange={this.handleOnChangeLocation} />
                    </Form.Group>

                    {/* <Form.Group>
                        <Form.Label>Insurance against</Form.Label>
                        <Form.Control as="select" onChange={this.handleOnChangeFlood}>
                            <option value="Flood">Flood</option>
                            <option value="Drought">Drought</option>
                        </Form.Control>
                    </Form.Group> */}

                    <Form.Group>
                        <Form.Label>Please Enter the CropId</Form.Label>
                        <Form.Control type="number" placeholder="0" onChange={this.handleOnChangeCropId} />
                    </Form.Group>

                    <Form.Group style={{ width: "50%" }}
                    >
                        <Form.Label>Enter the Duration of your Policy</Form.Label>
                        <InputGroup className="mb-3">
                            <FormControl id="duration" type="number" placeholder="12" aria-describedby="months" onChange={this.handleOnChangeDuration} />
                            <InputGroup.Append>
                                <InputGroup.Text id="=months">Months</InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>

                    <Button variant="primary" type="submit">Submit</Button>&nbsp;&nbsp;&nbsp;<Button variant="secondary" type="reset">Reset</Button>
                </Form>

                <div style={{padding:"20px"}}>
                    {this.state.premium ? <h5>
                        
                        Policy Details<br/>
                        Premium :{' '}{this.state.premium}<br/>
                        Coverage :{' '}{this.state.coverage}
                    </h5> : <h4 style={{color:"red"}}>Please enter valid details to calculate premium</h4>}
                    
                </div>

            </div>

        )
    }
}

CreatePolicy.contextTypes ={
    drizzle : PropTypes.object
  }
  
  const mapStateToProps = (state) => ({
    accounts : state.accounts,
  })
  


export default withRouter(drizzleConnect(CreatePolicy, mapStateToProps))
