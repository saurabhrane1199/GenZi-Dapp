import GenZContract from '../contracts/genz.json';



const options = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545'
    }
  },
    contracts : [GenZContract],
    syncAlways:true
  };


  export default options