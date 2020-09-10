var GENZContract = artifacts.require("./genz.sol");

module.exports = function(deployer) {
  deployer.deploy(GENZContract,{value:5000});
};

// module.exports = function(deployer) {
//   deployer.deploy(KYCContract);
// };