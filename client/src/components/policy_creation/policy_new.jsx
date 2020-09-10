import React, { Component } from 'react'
// import './policy.styles.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form, InputGroup, FormControl, Button} from 'react-bootstrap'


class CreatePolicy extends Component {
    constructor(props) {
        super(props)
        this.state = {
            area : 0,
            location : 'Mumbai',
            forFlood : true,
            cropId : 0,
            duration : 0
        }
    }

    handleOnChangeArea = (e) => {
        this.setState({
            area : e.target.value
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
        if(value=="Flood"){
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
            cropId : e.target.value
        })
    }

    handleOnChangeDuration = (e) => {
        this.setState({
            duration : e.target.value
        })
    }

    handleOnSubmit = (e) => {
        e.preventDefault();

    }

    // int:area str:location bool:forFlood int:cropId int:Duration

    render() {
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
