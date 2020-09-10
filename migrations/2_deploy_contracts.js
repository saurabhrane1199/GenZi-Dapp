
var KYCContract = artifacts.require("./kyc.sol");

module.exports = function(deployer) {
  deployer.deploy(KYCContract);
};
