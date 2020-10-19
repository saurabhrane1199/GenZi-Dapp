import React, { Component } from 'react'
import './mycontracts.styles.scss'
import PropTypes from 'prop-types'
import {drizzleConnect} from '@drizzle/react-plugin';

const TableRow = ({index, policy }) => 
(<tr>
        <td>{index + 1}</td>
        <td>{policy[3]}</td>
        <td>{policy[4]}</td>
        <td>{policy[5]}</td>
        <td>{convertUnixToDate(policy[6])}</td>
        {/* <td>{policy[6]}</td> */}
        <td>{convertUnixToDate(policy[7])}</td>
        <td>{policy[8]}</td>
        <td>{policy[9]}</td>
        <td>{policy[10]}</td>
        <td>{policy[11]}</td>
    </tr>)

function convertUnixToDate(epoch){
    let d = new Date(epoch*1000)
    return d.toLocaleDateString()

}




class PortFolio extends Component {

    constructor(props,context) {
        super(props);
        this.state = {
            policies: []
        }
        this.contracts = context.drizzle.contracts
    }


    
    componentDidMount() {
        let userPolicies = []
        
        console.log(this.contracts)
        this.contracts.genz.methods.getPolicyUser()
            .call()
            .then(res => {
                
                res.forEach(item => {
                    this.contracts.genz.methods.getPolicyDetails(item)
                        .call()
                        .then(policyDetails => {
                            console.log(policyDetails)
                            this.setState(prevState => ({
                                policies: [ ...prevState.policies,policyDetails ],
                            })) 

                            
                        })

                });
                
                
            })
             
            
    }
       

    render() {
            // return (<h5>{this.props.accounts[0]}</h5>)
        if ( this.state.policies.length==0) {
            return <div>Loading.....</div>
        }
        else {
            return (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Location</th>
                                <th>Premium</th>
                                <th>Area</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Coverage</th>
                                <th>Type</th>
                                <th>CropId</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.policies.map( (policy, index) => <TableRow index={index} policy={policy}/>)
                            }
                        </tbody>
                    </table>
                </div>
            )
        }
    }
}

PortFolio.contextTypes ={
    drizzle : PropTypes.object
}



export default PortFolio;