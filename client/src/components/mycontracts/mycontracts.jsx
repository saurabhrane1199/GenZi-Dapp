import React, { Component } from 'react'
import './mycontracts.styles.scss'

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




class MyContracts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            policies: []
        }
    }

    componentDidMount() {
        let userPolicies = []
        this.props.drizzle.contracts.genz.methods.getPolicyUser()
            .call()
            .then(res => {
                
                res.forEach(item => {
                    this.props.drizzle.contracts.genz.methods.getPolicyDetails(item)
                        .call()
                        .then(policyDetails => {

                            this.setState(prevState => ({
                                policies: [ ...prevState.policies,policyDetails ],
                            })) 

                            
                        })

                });
                
                
            })
             
            
    }
       

    render() {
        
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




export default MyContracts