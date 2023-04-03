//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.9;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

contract ArbitraryNft is ERC721 , ERC721Enumerable, ERC721URIStorage, ERC721Royalty, Ownable  {
    
    using Strings for uint256;
    

    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;


    mapping (uint256 => address) public  royaltyAcceptors;
    
    uint256 MAX_SUPPLY = 10_000;
    

    string public ipfsBaseURI; //TODO base64 data + properties ??
    uint256 public tokenIdGen;

    mapping (uint256 => uint256) public tokenIdToPrice;

    constructor( 
        string memory _tokenName,
        string memory _tokenSymbol,
        string memory _baseURI 
        )  ERC721(_tokenName, _tokenSymbol) payable {
            ipfsBaseURI = _baseURI;
    }

    event MintedNft(address indexed _from, uint256 _tokenId);

    /**
     * Mint NFT to nftOwner
     * 
     * @param nftOwner owner of NFT
     * @param feeRecipient The `feeNumerator` is used in conjunction with the `feeRecipient` parameter, 
     * which is the Ethereum address of the account that will receive the fee charged by the contract owner.
     * 
     * @param feeBsp The `feeNumerator` is an integer value that represents 
     * the percentage of the total transfer value that the contract owner will charge as 
     * a fee. For example, if the `feeNumerator` is set to 1000 and the value of the token being 
     * transferred is 1 ETH, then the fee charged by the contract owner will be 0.1 ETH (10% of 1 ETH).
     * @param price price of the NFT
     */
    function mintWithRoyalty(address nftOwner, address feeRecipient, uint96 feeBsp, uint256 price)
        public onlyOwner  {
         tokenIdGen = _tokenIdCounter.current();  
        _tokenIdCounter.increment();

        require(tokenIdGen <= MAX_SUPPLY, "Sorry, all NFTs have been minted!");
        require(owner() != feeRecipient,  "Recipient cannot be the owner of the contract");  
        
        
        _safeMint(nftOwner, tokenIdGen);
        _setTokenRoyalty(tokenIdGen, feeRecipient, feeBsp);

        tokenIdToPrice[tokenIdGen] = price;
        royaltyAcceptors[tokenIdGen] = feeRecipient;

        emit MintedNft (nftOwner, tokenIdGen);

        
   }


    function payRoyalty(uint256 tokenId) internal returns (uint256){
        uint256 price = tokenIdToPrice[tokenId];
        (address addr, uint256 royalty) = royaltyInfo(tokenId, price);
        // console.log("Royalty info %s,   price: %s", royalty, price);
        payable(addr).transfer(royalty); 
        return royalty;
    }

    function getTokenPrice(uint256 tokenId) public view returns (uint256){
        return tokenIdToPrice[tokenId];
    }

    
    function buy(uint256 _tokenId) public payable {
        uint256 price = tokenIdToPrice[_tokenId];
        require(msg.value == price, string.concat("Price does not equal required: ", price.toString() ));
        address seller = ownerOf(_tokenId);
        transferFrom(seller, msg.sender, _tokenId);

        uint256 royalty = payRoyalty(_tokenId);        
        // console.log("Royalty %s,  from price: %s", royalty, price);

        payable(seller).transfer(price - royalty); 
        
    }


    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize) 
      internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from,  to,  firstTokenId,  batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage, ERC721Royalty) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        // Concatenate the tokenID along with the '.json' to the baseURI
        return string(abi.encodePacked(ipfsBaseURI, tokenId.toString(), '.json'));
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable, ERC721Royalty) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
}