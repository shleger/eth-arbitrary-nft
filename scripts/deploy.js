async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const tokenName = "ArbitraryNft"
    const tokenSymbol = "ARB"
    const ipfsBaseUri = "ipfs://just_mock_resource/" 

      
    const Contract = await ethers.getContractFactory("ArbitraryNft");
    const contract = await Contract.deploy(tokenName, tokenSymbol, ipfsBaseUri);
  
    console.log("Token address:", contract.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });


// deployed to sepolia: 
// Deploying contracts with the account: 0x917Da71B7BCAC67dBb51DDB01bf37A76f07caf06
// Account balance: 558869691493971688
// Contract address: 0xC6849bBf7553Fee139C09D1b32D964851f81B690

//upload to etherscan
// npx hardhat verify --constructor-args scripts/arguments.js --network sepolia 0xC6849bBf7553Fee139C09D1b32D964851f81B690

// view
// https://sepolia.etherscan.io/address/0xC6849bBf7553Fee139C09D1b32D964851f81B690#readContract
// 