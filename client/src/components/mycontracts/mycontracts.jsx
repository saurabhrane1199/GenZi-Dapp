import React, { Component,useState } from 'react'
import './mycontracts.styles.scss'
import PropTypes from 'prop-types'
import {drizzleConnect} from '@drizzle/react-plugin';
import {Modal,Button} from 'react-bootstrap'


const PolicyAction = ({policyStatus,handleClaim, id}) => {
    if(policyStatus == 1){
        return <button className="claimButton" onClick={() => handleClaim(id)}>Claim</button>
    }
    else{
        return <button className="claimButton" style={{backgroundColor:"#e80f00", color:"white", width:"150px"}}>Policy Claimed</button>
    }
}

const TableRow = ({policy, handleClaim }) =>{

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
return (
    <>
    <tr>
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
        <td style={{textAlign:"center"}}>
            {policy[6]==1 ?
            <PolicyAction policyStatus={policy[7]} handleClaim={handleClaim} id={policy[4][0]} />
            : ''}
            <i 
                className="fa fa-info-circle"
                onClick={handleShow}
                style = {{fontSize:"20px",color:"#8ad0ff",cursor:"pointer"}}
            />
        </td>
        {/* <td>{policy[11]}</td> */}
    </tr>
    <Modal show={show} size="lg" onHide={handleClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Investment Details</Modal.Title>
    </Modal.Header>
    <Modal.Body >
        {
            policy[1].length>0 ? (<table style={{width:"100%"}}>
            <thead style={{textAlign:"center"}}>
                <th>Investor</th>
                <th>Amount Invested</th>
            </thead>
            <tbody>
                {policy[1].map((pol,index) =>
                    (
                        <tr>
                            <td>{pol}</td>
                            <td>{policy[2][index]}</td>
                        </tr>
                    )
                )}  
            </tbody>
        </table>) : <h4>No Investments found</h4>  



        }
        


    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
  </>)}

function convertUnixToDate(epoch){
    let d = new Date(epoch*1000)
    return d.toLocaleDateString()

}


class MyContracts extends Component {

    constructor(props,context) {
        super(props);
        this.state = {
            policies: []
        }
        this.contracts = context.drizzle.contracts
    }
    
    claimPolicy = (id) => {
        console.log(`Id Clicked : ${id}`)
        this.contracts.genz.methods.claim(id,"2020-7-20","2020-7-21")
        .send({from : this.props.accounts[0]})
        .then(res => {
            console.log(`Success ${res}`)
            window.location.reload(true)
        
        })
        .catch(err => alert(`Error Occured${err}`))
        
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
             
            
    }
       

    render() {
            // return (<h5>{this.props.accounts[0]}</h5>)
            if ( this.state.policies.length===0 || !this.state.policies) {
                return <div style={{textAlign:"center"}}>No policies Found</div>
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
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.policies.map( (policy, index) => <TableRow key={policy[4][0]} policy={policy} handleClaim={this.claimPolicy}/>)
                            }
                        </tbody>
                    </table>
                </div>
            )
        }
    }
}

MyContracts.contextTypes ={
    drizzle : PropTypes.object
}


const mapStateToProps = (state) => ({
    accounts : state.accounts,
  })


export default drizzleConnect(MyContracts, mapStateToProps);