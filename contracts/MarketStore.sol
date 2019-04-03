pragma solidity ^0.5.0;

/**
* @author Karen Suen
* @title Stores and manages all listings in marketplace
* This contract provides getters and setters for storing, accessing and
* modifying listings created in the marketplace. Basic security checks are
* implemented to prevent unauthorized use of functions e.g. only the seller
* of the listing can modify the listing or the listing must be in available
* state to be sold.
*/
contract MarketStore {

    enum ListingState {AVAILABLE, SOLD, INACTIVE} // {0,1,2}

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
        require(
            msg.sender == listings[listingId].seller,
            "Only the seller of this listing can disable it"
        );
        _;
    }

    modifier inAvailableState(uint listingId) {
        require(
          listings[listingId].state == ListingState.AVAILABLE,
          "The listing cannot be disabled during a transaction"
        );
        _;
    }

    /**
    * @dev Constructor initialises marketplace with 0 listings
    */
    constructor() public {
        totalListings = 0;
    }

    /**
    * @notice Create a new listing in the marketplace and returns its id
    * @dev The unique ID of each listing is auto generated using the incremented
    * total listing count. The list of seller's owned listings are also updated.
    * @param _price The selling price of the new listing
    * @param _title The string title of the new listing
    * @param _desc The string description of the new listing
    * @param _image The file hash of photo provided for new listing
    * @param _seller The seller address that created this listing (owner)
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
    * @notice Disable the given listing by updating its state to INACTIVE
    * @dev Sold or disabled listings could be activated again (relisted)
    * @param _id The id of listing to disable
    */
    function disableListing(uint _id) public sellerOnly(_id) {
        listings[_id].state = ListingState.INACTIVE;
    }

    /**
    * @notice To sell a listing, update the given listing to SOLD state
    * @param _id The id of listing to sell
    */
    function listingSold(uint _id) public {
        listings[_id].state = ListingState.SOLD;
    }

    /**
    * @dev Update the given listing to available state
    * @param _id The id of listing to make available in marketplace
    */
    function listingAvailable(uint _id) public {
        listings[_id].state = ListingState.AVAILABLE;
    }

    /**
    * @dev Returns the current state of a listing as an integer
    * @param _id The id of listing to retrieve the state of
    */
    function getListingState(uint _id) public view returns (uint) {
        return uint256(listings[_id].state);
    }

    /**
    * @notice Returns all information about a listing in the marketplace as a tuple
    * @dev The listing state enum value is returned as an integer
    * @param _id The id of listing to return
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
            uint256(listing.state) // enum state is returned as integer
        );
    }

    /**
    * @dev Returns a list of all listing id's created by an address
    * @param _seller The account to retrieve all listing ids for
    */
    function getAllSellerListings(address _seller) public view returns (uint[] memory) {
        return allUserListings[_seller];
    }
}
