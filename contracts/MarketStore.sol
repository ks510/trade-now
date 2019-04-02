pragma solidity ^0.5.0;

contract MarketStore {

  enum ListingState { AVAILABLE, SOLD, INACTIVE } // {0,1,2}

  struct ItemListing {
    uint id;
    uint price;
    string title;
    string description;
    string imageHash;
    address seller;
    ListingState state;
  }

  uint public totalListings;
  mapping(uint => ItemListing) public listings;
  mapping(address => uint[]) public allUserListings;

  modifier sellerOnly(uint listingId) {
    require(msg.sender == listings[listingId].seller,
            "Only the seller of this listing can disable it");
    _;
  }

  modifier inAvailableState(uint listingId) {
    require(listings[listingId].state == ListingState.AVAILABLE,
      "The listing cannot be disabled during a transaction");
    _;
  }

  constructor() public {
    totalListings = 0;
  }

  // creates and stores the new listing, returning the listing id
  // auto generate listing id using total listing count
  function createListingInStore(
    uint _price,
    string memory _title,
    string memory _desc,
    string memory _image,
    address _seller
  )
    public
    returns (uint) {
    totalListings++;
    listings[totalListings] = ItemListing(totalListings,
                                          _price,
                                          _title,
                                          _desc,
                                          _image,
                                          _seller,
                                          ListingState.AVAILABLE);
    // update user's owned listings
    allUserListings[_seller].push(totalListings);

    return totalListings;
  }

  // method for safely retrieving a listing from store
  function getListing(uint _id) public view returns (
    uint,
    uint,
    string memory,
    string memory,
    string memory,
    address,
    uint
  ) {
    ItemListing memory listing = listings[_id];
    return (listing.id,
            listing.price,
            listing.title,
            listing.description,
            listing.imageHash,
            listing.seller,
            uint256(listing.state)); // enum state is returned as integer
  }

  // method for safetly retrieving list of listings owned by an account
  function getAllSellerListings(address _seller) public view returns (uint[] memory) {
    return allUserListings[_seller];
  }

  // disable listing by updating its listing state
  function disableListing(uint _id) public sellerOnly(_id) inAvailableState(_id) {
   listings[_id].state = ListingState.INACTIVE;
  }

  // change listing state to sold
  function listingSold(uint _id) public {
    listings[_id].state = ListingState.SOLD;
  }
  // change listing state to available
  function listingAvailable(uint _id) public {
    listings[_id].state = ListingState.AVAILABLE;
  }

  // retrieve listing state
  function getListingState(uint _id) public view returns (uint) {
    return uint256(listings[_id].state);
  }
}
