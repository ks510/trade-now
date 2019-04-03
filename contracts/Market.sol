pragma solidity ^0.5.0;

import "./MarketStore.sol";
import "./Escrow.sol";

/**
* @author Karen Suen
* @title A proxy contract for interacting with low-level contracts
* @notice All client interactions should use this contract to modify the state
* of the marketplace (create or modify listings and transactions)
* @dev Basic security are implemented here to prevent unauthorised parties from
* tampering with listings and transactions.
* In practice, this proxy contract should have sole ownership of the low level
* contracts to ensure only this contract can invoke their methods by manually
* implementing ownership checks or using the OpenZeppelin Ownable contract.
* To reduce gas cost, business logic is implemented in the client app.
*/
contract Market {

  MarketStore marketStore;
  Escrow escrow;

  event ListingCreated(uint id);

  event Listing(
    uint id,
    uint price,
    string title,
    string description,
    address seller,
    uint state
  );

  // get contracts that store state at deployed addresses
  constructor(address _marketStore, address _escrow) public {
    marketStore = MarketStore(_marketStore);
    escrow = Escrow(_escrow);
  }

  function createListing(uint _price, string memory _title, string memory _desc)
    public
  {
    // create transaction in market store, seller is the sender of call
    uint listingId = marketStore.createListingInStore(_price, _title, _desc, msg.sender);
    // notify client the listing was succesfully created with the id of the listing
    emit ListingCreated(listingId);
  }

  function retrieveListing(uint _id) public {
    uint listingId;
    uint price;
    string memory title;
    string memory desc;
    address seller;
    uint state;
    (listingId, price, title, desc, seller, state) = marketStore.getListing(_id);
    emit Listing(listingId, price, title, desc, seller, state);
  }

  function buyListing(uint _listingId) public payable {
    uint price;
    address seller;
    (,price,,,seller,) = marketStore.getListing(_listingId);
    // check listing exists and is AVAILABLE to purchase
    // check buyer has sent sufficient funds
    // start transaction
    escrow.startTransaction(_listingId, msg.sender, seller, price);
    // send buyer funds to transaction
    //address payable escrow = address(uint160(getEscrowAddress()));
    //escrow.transfer(msg.value);

    //_listingSold(_listingId);
  }

  function confirmItemReceived(uint _listingId) public {
    // check listing exists
    // confirm transaction item received and release funds to buyer
  }

  function _validateBuyerFunds(uint _listingId, uint _buyerSent) private returns (bool) {
    // check buyer send correct amount
    return false;
  }

  // update listing state to sold
  function _listingSold(uint _id) private {
    marketStore.listingSold(_id);
  }

}
