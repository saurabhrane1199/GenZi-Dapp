import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';


class CreatePolicy extends Component {
    constructor(props) {
        super(props)
        this.state = {
            area: 0,
            location: 'Mumbai',
            forFlood: 1,
            cropId: 0,
            duration: 0,
            stackId: null
        }
    }

    handleOnChangeArea = (e) => {
        this.setState({
            area: Number(e.target.value)
        })

    }

    handleOnChangeLocation = (e) => {
        this.setState({
            location: e.target.value
        })
    }

    handleOnChangeFlood = (e) => {
        let flag = 1
        const value = e.target.value
        if (value === "Flood") {
            flag = 1
        } else {
            flag = 0
        }
        this.setState({
            forFlood: flag
        })
    }

    handleOnChangeCropId = (e) => {
        this.setState({
            cropId: Number(e.target.value)
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

    }

    setValue = () => {
        const {area,location,forFlood,cropId,duration} = this.state
        console.log(area,"Testing Data")
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.genz;

        const stackId = contract.methods["newPolicy"].cacheSend(area,forFlood,cropId,duration,location, {
            from: drizzleState.accounts[0],
            value:100
        });
        this.setState({ stackId },console.log(this.getTxStatus()));
    }

    getTxStatus = () => {
        const { transactions, transactionStack } = this.props.drizzleState;
        const txHash = transactionStack[this.state.stackId];
        if (!txHash) return null;
        return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`;
    };


    // int:area str:location bool:forFlood int:cropId int:Duration

    render() {
        return (
            <div className="Wrapper" style={{ width: "50%", margin: "0 auto" }}>
                <Form onSubmit={this.handleOnSubmit}>
                    <Form.Group style={{ width: "50%" }} controlId="farm_area">
                        <Form.Label>Enter the Area of Your Farm</Form.Label>
                        <InputGroup className="mb-3">
                            <FormControl id="inlineFormInputGroupUsername2" type="number" placeholder="8855" aria-describedby="sqkms" onChange={this.handleOnChangeArea} />
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
                        <Form.Control type="number" placeholder="8" onChange={this.handleOnChangeCropId} />
                    </Form.Group>

                    <Form.Group style={{ width: "50%" }} controlId="duration">
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
