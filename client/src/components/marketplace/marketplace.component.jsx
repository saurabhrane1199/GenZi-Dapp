import React, { Component } from 'react'
import './marketplace.styles.scss'
import PropTypes from 'prop-types'
import {drizzleConnect} from '@drizzle/react-plugin';
import {ReactComponent as CropLogo} from '../../seeding.svg';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';


const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Cover
    </Tooltip>
  );


const CoverButton = ({coverDetails, handleCover}) => {
    return(
        <OverlayTrigger
    placement="bottom"
    delay={{ show: 100, hide: 400 }}
    overlay={renderTooltip}
  >
        <button className="coverButton" onClick={() => handleCover(coverDetails[0],coverDetails[5],coverDetails[6])}>
            <CropLogo className="seedicon"/>
        </button>
        </OverlayTrigger>
    )
    
}

const TableRow = ({index, policy, handleCover }) => 
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
    <td style={{textAlign:"center"}}>
        <CoverButton coverDetails={policy[4]} handleCover={handleCover}/>
        {/* <button className="coverButton" tooltip="Cover" onClick={() => handleCover(policy[4][0],policy[4][5],policy[4][6])}><CropLogo className="seedicon"/></button>*/}
        </td> 
    {/* <td>{policy[11]}</td> */}
</tr>)

function convertUnixToDate(epoch){
    let d = new Date(epoch*1000)
    return d.toLocaleDateString()

}




class MarketPlace extends Component {

    constructor(props,context) {
        super(props);
        this.state = {
            policies: [],
        }
        this.contracts = context.drizzle.contracts
    }

    coverForPolicy = (id, coverageAmt, policySum) => {
        const val = prompt("Enter Amount")
        if(!val){
            return
        }
        const remainingSum = coverageAmt - policySum
        if(val > remainingSum){
            alert(`Please Enter a valid amount(Less than or equal to ${remainingSum} )`)
            return
        }
        this.contracts.genz.methods.coverForPolicy(id)
        .send({
            from: this.props.accounts[0],
            value:val
        }).then(()=>this.props.navigateToContracts())
        
    }


    componentDidMount() {        
        this.contracts.genz.methods.getPolicyLength()
            .call()
            .then(len =>{
                console.log(len)
                for (let i = 0; i < len; i++) {
                    this.contracts.genz.methods.getPolicyDetails(i)
                        .call()
                        .then(policyDetails => {
                            console.log(policyDetails)
                            this.setState(prevState => ({
                                policies: [ ...prevState.policies,policyDetails ],
                            })) 

                            
                        });

                }

            });
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
                                this.state.policies
                                .filter(policy => policy[6]==0)
                                .map( (policy, index) => <TableRow handleCover={this.coverForPolicy} key={policy[4][0]} policy={policy}/>)
                            }
                        </tbody>
                    </table>
                </div>
            )
        }
    }
}

MarketPlace.contextTypes ={
    drizzle : PropTypes.object
}


const mapStateToProps = (state) => ({
    accounts : state.accounts,
  })
  

export default drizzleConnect(MarketPlace, mapStateToProps);