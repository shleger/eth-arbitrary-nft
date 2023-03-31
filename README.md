# Arbitrary NFT implemetation with usage of openzeppelin library 

https://docs.openzeppelin.com/contracts/4.x/api/token/erc721 

## Task:

1)  Create a NFT contract (ERC-721) that support 

     a) arbitrary type/number of attributes,
     
     b) royalty payment to a NFT original creator

2) Create an Unit Test that validates 1a and 1b
3) Deploy the contract to any testnet and verify it


## Upload to etherscan
npx hardhat verify --constructor-args scripts/arguments.js --network sepolia CONTRACT_ADDRESS

### Sepoilia 

https://sepolia.etherscan.io/address/0xC6849bBf7553Fee139C09D1b32D964851f81B690#readContract


## CI


[![CircleCI](https://circleci.com/gh/shleger/eth-arbitrary-nft/tree/master.svg?style=svg)](https://app.circleci.com/pipelines/github/shleger/eth-arbitrary-nft)







