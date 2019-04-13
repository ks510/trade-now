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

  event TotalListings(uint totalListings);

  event ListingCreated(uint id);

  event Listing(
    uint id,
    uint price,
    string title,
    string description,
    address seller,
    uint state
  );

  /**
  * @dev Constructor initialises instances of low-level storage contracts for
  * this proxy contract.
  */
  constructor(address _marketStore, address _escrow) public {
    marketStore = MarketStore(_marketStore);
    escrow = Escrow(_escrow);
  }

  /**
  * @dev Create a new listing in the marketplace and notifies client with the
  * new listing id through event. Sender of this function is assumed to be the
  * seller of the listing.
  * @param _price The selling price of listing
  * @param _title The string title of the listing and item for sale
  * @param _desc The string description of the listing
  */
  function createListing(
    uint _price,
    string memory _title,
    string memory _desc,
    string memory _image
  )
    public
  {
    uint listingId = marketStore.createListingInStore(_price, _title, _desc, _image, msg.sender);

    emit ListingCreated(listingId);
  }

  /**
  * @dev Returns all information about a listing through through an event.
  * @param _id The id of listing to retrieve
  */
  function retrieveListing(uint _id) public {
    uint listingId;
    uint price;
    string memory title;
    string memory desc;
    string memory image;
    address seller;
    uint state;
    (listingId, price, title, desc, image, seller, state) = marketStore.getListing(_id);
    emit Listing(listingId, price, title, desc, seller, state);
  }

  /**
  * @dev Sender of this function purchases the given listing and sends the
  * correct amount of funds to be held in escrow. This function assumes the
  * correct amount of funds are sent and the listing exists.
  * @param _listingId The listing id to purchase with funds
  */
  function buyListing(uint _listingId) public payable {
    uint price = marketStore.getListingPrice(_listingId);
    address seller = marketStore.getListingSeller(_listingId);
    // start transaction
    escrow.startTransaction(_listingId, msg.sender, seller, price);
    // send buyer funds to transaction
    //address payable escrow = address(uint160(getEscrowAddress()));
    //escrow.transfer(msg.value);

    //_listingSold(_listingId);
  }

  /**
  * @dev Updates a transaction to confirmed status, triggering release of
  * buyer's purchase funds to the seller
  * @param _listingId The id of listing to update
  */
  function confirmItemReceived(uint _listingId) public {
    // check listing exists
    // confirm transaction item received and release funds to buyer
  }

  function getTotalListings() public {
    uint total = marketStore.totalListings();
    emit TotalListings(total);
  }

  // update listing state to sold
  function _listingSold(uint _id) private {
    marketStore.listingSold(_id);
  }


}
