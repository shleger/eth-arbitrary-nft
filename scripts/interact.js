const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;




const contract = require("../artifacts/contracts/ArbitraryNft.sol/ArbitraryNft.json");
console.log(JSON.stringify(contract.abi));

const provider = new ethers.providers.EtherscanProvider("sepolia", ETHERSCAN_API_KEY);
console.log(JSON.stringify(provider));

// Signer
// const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Contract
// const tokenContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

// console.log(JSON.stringify(tokenContract));