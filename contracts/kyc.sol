pragma solidity >=0.4.22 <0.8.0;

contract kyc{
    struct Details{
        uint aadhaar;
        string name;
        address id;
        uint role;
    }

    mapping (address => address) public request;
    mapping (address => address) public auth;
    Details [] public details;
    mapping (address => uint) public deets;

    function _register(uint aadhaar, string memory name, uint role) public {
        details.push(Details(aadhaar,name, msg.sender, role)) ;
        deets[msg.sender]=details.length-1;
    }

    function getDetails() public view returns (uint, string memory, uint) {
        return (details[deets[msg.sender]].aadhaar, details[deets[msg.sender]].name, details[deets[msg.sender]].role );
    }
    
    function requestFarmer(address farmerAddress) public {
        // find farmer address using his aadhaar
        require(details[deets[farmerAddress]].role == 0);
        require(details[deets[msg.sender]].role == 1);
        request[farmerAddress] = msg.sender; 
    }

    function approveInvestor() public returns (uint, string memory, uint){
        
        require(details[deets[msg.sender]].role == 0);
        address investorAddress = request[msg.sender];
        auth[msg.sender] = investorAddress;

        return (details[deets[msg.sender]].aadhaar, details[deets[msg.sender]].name, details[deets[msg.sender]].role );

    }
}