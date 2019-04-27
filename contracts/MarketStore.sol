pragma solidity ^0.5.0;

/**
* @author Karen Suen
* @notice Stores and manages the state of all listings in the marketplace.
* This is a low level storage contract that provides getters and setters for
* creating, accessing and modifying listings. Currently, a reference is stored
* for fetching the listing image from a distributed database due to the expensive
* cost of storing large data on the blockchain. For optimisation reasons,
* business logic should be implemented in the client application.
*/
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

    /**
    * @notice Constructor initialises marketplace with no listings
    */
    constructor() public {
        totalListings = 0;
    }

    /**
    * @dev Create a new listing in the marketplace and returns its generated id.
    * Indexing of listings always starts at 1. The unique ID of each listing is
    * auto generated using the incremented total listing count. The list of
    * seller's owned listings are also updated.
    * @param _price The selling price of the new listing in Wei
    * @param _title The title of the new listing
    * @param _desc The reference hash of listing description stored in a distributed database
    * @param _image The reference hash of listing image stored in a distributed database
    * @param _seller The seller address that created this listing (owner)
    * @return Generated id of listing in the marketplace
    */
    function createListingInStore(
        uint _price,
        string memory _title,
        string memory _desc,
        string memory _image,
        address _seller
    )
        public
        returns (uint)
    {
        // create listing and store in contract
        totalListings++;
        listings[totalListings] = ItemListing(
          totalListings,
          _price,
          _title,
          _desc,
          _image,
          _seller,
          ListingState.AVAILABLE
        );

        // update user's owned listings
        allUserListings[_seller].push(totalListings);

        return totalListings;
    }

    /**
    * @dev Disable the given listing by updating its status to INACTIVE
    * @param _id The id of listing to disable
    */
    function disableListing(uint _id) public {
        listings[_id].state = ListingState.INACTIVE;
    }

    /**
    * @dev Updates the given listing to SOLD status
    * @param _id The id of sold listing
    */
    function listingSold(uint _id) public {
        listings[_id].state = ListingState.SOLD;
    }

    /**
    * @dev Updates the given listing to AVAILABLE status
    * @param _id The id of listing to make available in marketplace
    */
    function listingAvailable(uint _id) public {
        listings[_id].state = ListingState.AVAILABLE;
    }

    /**
    * @notice Returns all information about a listing in the marketplace as a tuple
    * @dev The listing state enum value is returned as an integer
    * @param _id The id of listing to return
    * @return Listing id, price in Wei, title, description, image reference,
    * seller address
    */
    function getListing(uint _id) public view returns (
        uint,
        uint,
        string memory,
        string memory,
        string memory,
        address,
        uint
    )
    {
        ItemListing memory listing = listings[_id];
        return (
            listing.id,
            listing.price,
            listing.title,
            listing.description,
            listing.imageHash,
            listing.seller,
            // state is returned as integer corresponding to order of defined enum values
            uint256(listing.state)
        );
    }

    /**
    * @dev Returns a list of all listing id's created by an address (user)
    * @param _seller The address to retrieve all listing ids for
    * @return A list of listing ids
    */
    function getAllSellerListings(address _seller) public view returns (uint[] memory) {
        return allUserListings[_seller];
    }

    /**
    * @dev Returns the selling price of a given listing in Wei (smallest
    * denomination of Ether)
    * @param _id The id of listing to retrieve selling price of
    * @return Listing price in Wei
    */
    function getListingPrice(uint _id) public view returns (uint) {
      return listings[_id].price;
    }

    /**
    * @dev Returns the title of a given listing
    * @param _id The id of listing to retrieve title of
    * @return Listing title
    */
    function getListingTitle(uint _id) public view returns (string memory) {
      return listings[_id].title;
    }

    /**
    * @dev Returns the description reference of a given listing
    * @param _id The id of listing to retrieve the description of
    * @return Listing description
    */
    function getListingDescription(uint _id) public view returns (string memory) {
      return listings[_id].description;
    }

    /**
    * @dev Returns the image reference of a given listing
    * @param _id The id of listing to retrieve the image reference of
    * @return Image reference
    */
    function getListingImage(uint _id) public view returns (string memory) {
      return listings[_id].imageHash;
    }

    /**
    * @dev Returns the seller of the listing
    * @param _id The id of listing to retrieve the state of
    * @return Seller address
    */
    function getListingSeller(uint _id) public view returns (address) {
      return listings[_id].seller;
    }

    /**
    * @dev Returns the current state of a listing as an integer
    * @param _id The id of listing to retrieve the state of
    * @return Listing status
    */
    function getListingState(uint _id) public view returns (uint) {
        return uint256(listings[_id].state);
    }
}
