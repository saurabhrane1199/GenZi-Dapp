import React, { Component } from 'react'
import './portfolio.styles.scss'
import PropTypes from 'prop-types'


const TableRow = ({policy, handleClaim }) => 
(<tr>
    <td>{policy[4][0]}</td>
    <td>{policy[3]}</td>
    <td>{policy[4][1]}</td>
    <td>{policy[4][2]}</td>
    <td>{convertUnixToDate(policy[4][3])}</td>
    {/* <td>{policy[6]}</td> */}
    <td>{convertUnixToDate(policy[4][4])}</td>
    <td>{policy[4][5]}</td>
    <td>{policy[4][6]}</td>
    <td>{policy[5]}</td>
    <td>{policy[6]==0 ? "Open" : "Closed"}</td>
    {/* <td><button onClick={() => handleClaim(policy[0])}>Claim</button></td> */}
    {/* <td>{policy[11]}</td> */}
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
            .catch(err => alert(`Error : ${err}`))
             
            
    }
       

    render() {
        if ( this.state.policies.length===0) {
            return <div>No Policies Found</div>
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
                                <th>Policy Sum</th>
                                <th>CropId</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.policies.map( (policy, index) => <TableRow key={index} index={index} policy={policy}/>)
                            }
                        </tbody>
                    </table>
                </div>
            )
        }
    }
}

PortFolio.contextTypes = {
    drizzle : PropTypes.object
}



export default PortFolio;