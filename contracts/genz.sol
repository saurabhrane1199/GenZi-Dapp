pragma solidity >=0.4.24;

// import "./DateTime.sol";
// import "./strings.sol";

contract genz{

    struct Details{
        uint aadhaar;
        string name;
        address id;
        uint role;
        int bal;
    }

    mapping (address => address) public request;
    mapping (address => address) public auth;
    Details [] public details;
    mapping (address => uint) public deets;

    function _register(uint aadhaar, string memory name, uint role) public {
        details.push(Details(aadhaar,name, msg.sender, role, 0)) ;
        deets[msg.sender]=details.length-1;
    }

    function getDetails() public view returns (uint, string memory, uint) {
        return (details[deets[msg.sender]].aadhaar, details[deets[msg.sender]].name, details[deets[msg.sender]].role );
    }
    
    function getBalanceUser() public view returns(int){
        return details[deets[msg.sender]].bal;
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

    //for BaseMin to BaseMax -> BasePayout% . for > Max -> MaxPayout%
    uint8 constant floodBaseMin = 10;
    uint8 constant floodBaseMax = 15;
    uint8 constant floodBasePayout = 50;  //50% of coverage
    uint8 constant floodMaxPayout = 100;  //100% of coverage

    //for BaseMin to BaseMax -> BasePayout% . for < Min -> MaxPayout%
    uint8 constant droughtBaseMin = 2;
    uint8 constant droughtBaseMax = 5;
    uint8 constant droughtBasePayout = 50;  //50% of coverage
    uint8 constant droughtMaxPayout = 100;  //100% of coverage
    
    struct cropType {
        string name;
        uint premiumPerAcre;    //in wei
        uint coveragePerAcre;   //in wei
    }
    
    struct policy {
        uint policyId;
        address payable user;
        address payable cover;
        uint role;
        uint premium;
        uint area;
        uint duration;
        uint startTime;
        uint endTime;         //crop's season dependent
        string location;
        uint coverageAmount;  //depends on crop type
        bool forFlood;
        uint8 cropId;
        policyState state;
    }
    
    enum policyState {Pending, Active, PaidOut, TimedOut}

    uint private balance; // holds the amount in the risk pool 
    uint private result = 7;
    uint private claimPolicyId;
    uint public payoutAmount;

    policy[] public policies; // holds all the policies
    cropType[2] public cropTypes; //crops defined in constructor
    mapping(address => uint[]) public userPolicies;  //user address to array of policy IDs
    
    // used to initialize the risk pool
    constructor()
    public payable
    {
        require(msg.value == 5000 wei, "5000 wei initial funding required");
        
        newCrop(0, "rabi", 1,  7);
        newCrop(1, "kharif", 2,  10);
        balance+=msg.value;
    }
    
    // function to add new crops. 
    // It can be added only by the risk body which determines the premium and cover for the same
    function newCrop(uint8 _cropId,string memory _name, uint _premiumPerAcre, uint _coveragePerAcre) internal {
        cropType memory c = cropType(_name, _premiumPerAcre, _coveragePerAcre);
        cropTypes[_cropId] = c;
    }
    
    // get policy details 
    function getPolicyDetails(uint _policyId) public view returns(uint, uint, uint, uint, uint, string memory,uint, policyState){
        require(policies[_policyId].user == msg.sender || policies[_policyId].cover == msg.sender, "Only authorized people allowed to access");
        policy memory p = policies[_policyId];
        return (p.premium,p.area,p.startTime,p.endTime,p.coverageAmount,p.location,p.cropId,p.state);
    }
    
    // TODO:- integrate duration with cover calulcation TODO
    // function to create a new policy
    function newPolicy (uint _area, string memory _location, bool _forFlood, uint8 _cropId, uint _duration) public payable{
        require(details[deets[msg.sender]].role == 0, "Only farmer can make a new policy");
        require(msg.value == (cropTypes[_cropId].premiumPerAcre * _area),"Incorrect Premium Amount");
        balance += msg.value; // update risk pool balance
        details[deets[msg.sender]].bal -= int(msg.value); // update user balance

        uint pId = policies.length++;
        userPolicies[msg.sender].push(pId);
        policy storage p = policies[pId]; // store the policy in an array

        p.user = msg.sender;
        p.role = details[deets[msg.sender]].role;
        p.premium = cropTypes[_cropId].premiumPerAcre * _area;
        p.area = _area;
        p.startTime = block.timestamp;
        p.duration = _duration;
        p.endTime = block.timestamp + _duration * 30*24*60*60;  //converting months to seconds
        p.location = _location;
        p.coverageAmount = cropTypes[_cropId].coveragePerAcre * _area;
        p.forFlood = _forFlood;
        p.cropId = _cropId;
        p.state = policyState.Active;
    }
    
    // TODO:- make arrangements for adding contribution and return for each investors TODO
    function coverForPolicy(uint _policyId) external payable{
        require(details[deets[msg.sender]].role == 1, "Only investors can provide money");
        
        policy storage p = policies[_policyId];
        require(msg.value == p.coverageAmount,"Incorrect Cover Amount");
        
        details[deets[msg.sender]].bal -= int(msg.value);
        balance += msg.value;
        userPolicies[msg.sender].push(_policyId);
        p.cover = msg.sender;
        
    }

    // give amount of risk pool
    function getBalance() public view returns(uint){
        return balance;
    }
    
    // can be called only by the farmer to claim the cover
    function claim(uint _policyId) public {
        require(msg.sender == policies[_policyId].user, "User Not Authorized");
        require(policies[_policyId].state == policyState.Active, "Policy Not Active");

        if(block.timestamp > policies[_policyId].endTime)
        {
            policies[_policyId].state = policyState.TimedOut;
            revert("Policy's period has Ended.");
        }
        
        claimPolicyId = _policyId;
        
        /* TODO check weather condition over here TODO*/
        
        // check condition and accordingly pay 
        if(policies[claimPolicyId].forFlood){
            if (result < floodBaseMin){
                payoutAmount = uint(policies[claimPolicyId].premium * floodMaxPayout/100) + policies[claimPolicyId].coverageAmount;
                policies[claimPolicyId].cover.transfer(payoutAmount);
                policies[claimPolicyId].state = policyState.PaidOut;
                balance-=payoutAmount;
                details[deets[policies[claimPolicyId].cover]].bal += int(payoutAmount);
            }
            else if (result > floodBaseMax){
                payoutAmount = uint(policies[claimPolicyId].coverageAmount * floodMaxPayout/100);
                policies[claimPolicyId].user.transfer(payoutAmount);
                policies[claimPolicyId].state = policyState.PaidOut;
                balance-=payoutAmount;
                details[deets[policies[claimPolicyId].user]].bal += int(payoutAmount);
            }
            else{
                payoutAmount = uint(policies[claimPolicyId].coverageAmount * floodBasePayout/100);
                policies[claimPolicyId].user.transfer(payoutAmount);
                policies[claimPolicyId].state = policyState.PaidOut;
                balance-=payoutAmount;
                details[deets[policies[claimPolicyId].user]].bal += int(payoutAmount);
            }
            
        }
        else{
            if(result > droughtBaseMax){
                payoutAmount = uint(policies[claimPolicyId].premium * floodMaxPayout/100) + policies[claimPolicyId].coverageAmount;
                policies[claimPolicyId].cover.transfer(payoutAmount);
                policies[claimPolicyId].state = policyState.PaidOut;
                balance-=payoutAmount;
                details[deets[policies[claimPolicyId].cover]].bal += int(payoutAmount);
            }
            else if (result < droughtBaseMin){
                payoutAmount = uint(policies[claimPolicyId].coverageAmount * droughtMaxPayout/100);
                policies[claimPolicyId].user.transfer(payoutAmount);
                policies[claimPolicyId].state = policyState.PaidOut;
                balance-=payoutAmount;
                details[deets[policies[claimPolicyId].user]].bal += int(payoutAmount);
            }
            else{
                payoutAmount = uint(policies[claimPolicyId].coverageAmount * droughtBasePayout/100);
                policies[claimPolicyId].user.transfer(payoutAmount);
                policies[claimPolicyId].state = policyState.PaidOut;
                balance-=payoutAmount;
                details[deets[policies[claimPolicyId].user]].bal += int(payoutAmount);
            }
        }
    }
    
    //Fallback function to implement the ability for the Contract Address to Accept Ether
    // function() public payable {}
    
}