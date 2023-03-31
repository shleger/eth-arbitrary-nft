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
