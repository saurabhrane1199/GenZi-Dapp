import React, {Component} from 'react'
import './mycontracts.styles.scss'

class MyContracts extends Component {

    userPolicies = []

    getData(){
        this.props.drizzle.contracts.genz.methods.getPolicyUser().call()
        .then(res => {
            console.log(res)
            res.forEach(item => {
                this.props.drizzle.contracts.genz.methods.getPolicyDetails(item)
                .call()
                .then(policy => this.userPolicies.push(policy))
                
            });
            console.log(this.userPolicies)
        }
        
        )
        
        
    }

    constructor(props){
        super(props);
        this.state = {
            policies : []
        }
    }
    
    componentDidMount(){
        this.getData()
    }

    render(){
        return(

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Goes By</th>
                            <th>Gender</th>
                            <th>Class</th>
                            <th>Alive</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Malcolm</td>
                            <td>Reynolds</td>
                            <td>Mal, Cap'n</td>
                            <td>M</td>
                            <td>Captain</td>
                            <td>Yes</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Zoe</td>
                            <td>Washburn</td>
                            <td>Zoe</td>
                            <td>F</td>
                            <td>First Mate</td>
                            <td>Yes</td>
                        </tr>
                        <tr className="disabled">
                            <td>3</td>
                            <td>Hoban</td>
                            <td>Washburn</td>
                            <td>Wash</td>
                            <td>M</td>
                            <td>Pilot</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>Kaylee</td>
                            <td>Frye</td>
                            <td>Kaylee</td>
                            <td>F</td>
                            <td>Mechanic</td>
                            <td>Yes</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }



}




export default MyContracts