const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const BigNumber = require("bignumber.js");

async function gasUsed (tx){
  const receipt = await tx.wait();
  const gasUsed = BigInt(receipt.cumulativeGasUsed) * BigInt(receipt.effectiveGasPrice);
  return Number(gasUsed)

}

async function getEmmitedValue (eventName, tx) {
  const receipt = await tx.wait();
  for (const event of receipt.events) {
    // console.log(`Event ${event.event} with args ${event.args}`);
    if (event.event == eventName) return event.args[1];    
  }
  throw new Error("Event: " + eventName + " not found!");
}

describe("Arbitrary NFT contract ", function () {
  async function deployFixture() {
    const ArbitraryNft = await ethers.getContractFactory("ArbitraryNft");
    const [contractOwner, nftIssuer, nftOwner, newOwner] = await ethers.getSigners();
    const tokenName = "ArbitraryNft"
    const tokenSymbol = "ARB"
    const ipfsBaseUri = "ipfs://ffjjrrss/" 

    const contract = await ArbitraryNft.deploy(tokenName, tokenSymbol, ipfsBaseUri);
    await contract.deployed();

    const tokenPrice = ethers.utils.parseEther('0.005')
    const feeBsp = 1000 
    const tx = await contract.mintWithRoyalty(nftOwner.address, nftIssuer.address, feeBsp ,tokenPrice);
    
    const tokenId = getEmmitedValue("MintedNft", tx);



  
  
    return { ipfsBaseUri, ArbitraryNft, contract, 
             contractOwner, nftIssuer, nftOwner, newOwner, 
             tokenId, tokenPrice, feeBsp};
  }

  it("Should has name ", async () =>{
    const { contract, contractOwner,nftIssuer, nftOwner} = await loadFixture(deployFixture);

    const name = await contract.name();
    expect("ArbitraryNft").to.equal(name);
  }).timeout(10000);;



  it("should return the tokenURI for a provided tokenId", async () => {
    
    const tokenId = 0
    const { contract, ipfsBaseUri} = await loadFixture(deployFixture);

    const result = await contract.tokenURI(tokenId);
    expect(result).to.equal(`${ipfsBaseUri}${tokenId}.json`);

  }).timeout(10000);;

  it("should return the correct royalty info when specified", async () => {
    const testPrice = 100;   
    feeDenom100bsp = 10000
    const { contract, nftIssuer, feeBsp, tokenId} = await loadFixture(deployFixture);
    
            
    const royaltyInfo = await contract.royaltyInfo(tokenId, testPrice);
    expect(royaltyInfo[0]).to.equal(nftIssuer.address);
    expect(royaltyInfo[1]).to.equal(new BigNumber(testPrice).multipliedBy(feeBsp).dividedBy(feeDenom100bsp).toNumber());
    // console.log("Royalty for %s bsp is %s,  from  price: %s", feeBsp, royaltyInfo[1], testPrice);
  
  }).timeout(10000);


  it("should transfers ownership of a token from nftOwner to newOwner", async () => {

    const { contract, nftIssuer, nftOwner, newOwner, tokenId, feeBsp} = await loadFixture(deployFixture);
    
    // ensure owner is the initial owner of the token
    expect(await contract.ownerOf(tokenId)).to.equal(nftOwner.address);

    await contract.connect(nftOwner).transferFrom(nftOwner.address, newOwner.address, tokenId);
    // ensure recipient is the new owner of the token
    expect(await contract.ownerOf(tokenId)).to.equal(newOwner.address);

  }).timeout(10000);


  it("should buy NFT with sending royalties ", async () => {

    const { contract, nftIssuer, nftOwner, newOwner, tokenId, tokenPrice, feeBsp} = await loadFixture(deployFixture);
    const initialNftOwnerBalance = await nftOwner.getBalance();
    const initialNewOwnerBalance = await newOwner.getBalance();
    const initialNftIssuerBalance = await nftIssuer.getBalance();

    // ensure owner is the initial owner of the token
    expect(await contract.ownerOf(tokenId)).to.equal(nftOwner.address);

    const tx1 =await contract.connect(nftOwner).approve(newOwner.address, tokenId);
    const gasUsed1 = await gasUsed(tx1)
    
    const tx2 = await contract.connect(newOwner).buy(tokenId, { value: tokenPrice });
    const gasUsed2 = await gasUsed(tx2)
    
    const afterNftOwnerBalance = await nftOwner.getBalance();
    const afterNewOwnerBalance = await newOwner.getBalance();
    
    const royalty = tokenPrice.div(feeBsp * 0.01)
    expect(afterNftOwnerBalance).to.equal(initialNftOwnerBalance
      .add(tokenPrice)
      .sub(Number(gasUsed1))
      .sub(royalty));

    expect(afterNewOwnerBalance).to.equal(initialNewOwnerBalance.sub(tokenPrice).sub(Number(gasUsed2)));

    // ensure recipient is the new owner of the token
    expect(await contract.ownerOf(tokenId)).to.equal(newOwner.address);

  }).timeout(10000);


});


