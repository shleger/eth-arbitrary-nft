require("@nomicfoundation/hardhat-toolbox");
require ("dotenv/config");
require("@nomiclabs/hardhat-etherscan");

const ALCHEMY_API_KEY = "00000000000000000000000000000000" //process.env.ALCHEMY_API_KEY || "";
const INFURA_API_KEY  = "00000000000000000000000000000000" //process.env.ALCHEMY_API_KEY || "";
const ETHERSCAN_API_KEY  = "00000000000000000000000000000000" //process.env.ETHERSCAN_API_KEY || "";
const SEPOLIA_MY_METAMASK_PRIVATE_KEY = "0000000000000000000000000000000000000000000000000000000000000000" // process.env.SEPOLIA_MY_METAMASK_PRIVATE_KEY || "";

module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "hardhat",
  networks: {
    hardhat:{},
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_MY_METAMASK_PRIVATE_KEY]
    },
    infura: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_MY_METAMASK_PRIVATE_KEY]
    }
  },
  etherscan: {
    // see argument.js for constructor
    //https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-etherscan
    // npx hardhat verify --constructor-args arguments.js DEPLOYED_CONTRACT_ADDRESS
    url: `https://etherscan.io`,
    // apiKey: ETHERSCAN_API_KEY
    apiKey: {
      sepolia: ETHERSCAN_API_KEY
    }
  }
};
