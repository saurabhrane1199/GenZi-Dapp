const path = require("path");

const HDWalletProvider = require('truffle-hdwallet-provider-privkey');
const privateKey = "private-key-goes-here";
const endpointUrl = "endpoint-goes-here";


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    kovan: {
      provider: function() {
        return new HDWalletProvider(
          //private keys array
          ["aea95e2f647b3a3f427a7c52225cb4dfddf37c7acd147f67fd8ee33ce5e49611"],
          //url to ethereum node
          "https://kovan.infura.io/v3/7b0fb37f270d4bafb5f207b51571e5bc"
        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 42
    }
 

  }
};
