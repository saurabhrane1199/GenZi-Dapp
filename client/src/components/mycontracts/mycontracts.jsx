import React, { Component } from 'react'
import './mycontracts.styles.scss'

const TableRow = ({ key,index, policy }) => (
    <tr>
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
    </tr>

)

function convertUnixToDate(epoch){
    let d = new Date(epoch*1000)
    console.log(d)
    return d.toLocaleDateString()

}




class MyContracts extends Component {

    getData() {
        this.props.drizzle.contracts.genz.methods.getPolicyUser()
            .call()
            .then(res => {
                let userPolicies = []
                res.forEach(item => {
                    this.props.drizzle.contracts.genz.methods.getPolicyDetails(item)
                        .call()
                        .then(policyDetails => {
                            userPolicies.push(policyDetails)
                        })

                });
                this.setState({ policies: userPolicies })
            });

    }

    constructor(props) {
        super(props);
        this.state = {
            policies: null
        }
    }

    componentDidMount() {
        this.getData()

    }

    render() {
        if (this.state.policies === null) {
            return <div>Loading.....</div>
        }
        //p.user,p.cover,p.amtCover,p.location,p.premium,p.area,p.startTime,p.endTime,p.coverageAmount,p.forFlood,p.cropId,p.state
        else {
            console.log(this.state.policies)
            const policies = this.state.policies
            console.log(policies)
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
                                policies.map((policy, idx) =>
                                    (
                                        <TableRow key={idx} index={idx} policy={policy} />

                                    ))


                            }
                        </tbody>
                    </table>
                </div>
            )
        }
    }
}




export default MyContracts