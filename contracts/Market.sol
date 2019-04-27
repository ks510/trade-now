pragma solidity ^0.5.0;

import "./MarketStore.sol";
import "./Escrow.sol";

/**
* @author Karen Suen
* @notice A proxy contract for interacting with low-level contracts.
* All client interactions should use this contract to modify the state
* of the marketplace (create, access, modify listings and transactions)
* In practice, this proxy contract should have "ownership" of the low level
* contracts to ensure only this contract can invoke their methods by manually
* implementing ownership checks or using the OpenZeppelin Ownable contract.
* To reduce gas cost, business logic is implemented in the client app.
* This proxy contract can be replaced to support upgradability without losing
* the current data stored in the contract which is maintained by MarketStore
* and Escrow. Listings are never removed, use INACTIVE state to disable listings.
*/
contract Market {

    MarketStore marketStore;
    Escrow escrow;

    /**
    * @notice Event for notifying about a new listing
    * @param id Id of the new listing
    */
    event ListingCreated(uint id);

    /**
    * @notice Event for notifying about an existing listing being disabled
    * @param id Id of the disabled listing
    */
    event ListingDisabled(uint id);

    /**
    * @notice Event for notifying about a selling a listing
    * @param id Id of the sold listing
    */
    event ListingSold(uint id);

    /**
    * @dev Constructor initialises instances of low-level storage contracts for
    * this proxy contract using the given contract addresses.
    */
    constructor(address _marketStore, address _escrow) public {
        marketStore = MarketStore(_marketStore);
        escrow = Escrow(_escrow);
    }

    /**
    * @dev Create a new listing in the marketplace and notifies client with the
    * new listing id through event. Sender of this function is assumed to be the
    * seller of the listing.
    * @param _price The selling price of listing in Wei
    * @param _title The title of the listing and item for sale
    * @param _desc The description of the listing
    * @param _image The reference for accessing the image from a distributed database
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
    * @dev Sender of this function purchases the given listing and sends the
    * purchase funds to be held in escrow. This function assumes the
    * correct amount of funds are sent and the listing exists so safety checks
    * should be implemented by the client app.
    * @param _listingId The listing id to purchase with funds
    */
    function buyListing(uint _listingId) public payable {
        uint price = marketStore.getListingPrice(_listingId);
        address seller = marketStore.getListingSeller(_listingId);

        // start transaction and escrow funds to storage contract
        escrow.startTransaction(_listingId, msg.sender, seller, price);
        escrow.fundTransaction.value(msg.value)(_listingId);

        // update listing state to sold
        marketStore.listingSold(_listingId);
        emit ListingSold(_listingId);
    }

    /**
    * @dev Updates a transaction to confirmed status, triggering release of
    * buyer's purchase funds to the seller and completing the trade.
    * @param _transactionId The id of listing to update
    */
    function confirmItemReceived(uint _transactionId) public {
        // confirm transaction item received and release funds to buyer
        escrow.confirmItemReceived(_transactionId);
    }


    /**
    * @dev Updates a listing to disabled status to indicate it is no longer
    * available for sale.
    * @param _listingId The id of listing to update
    */
    function disableListing(uint _listingId) public {
        marketStore.disableListing(_listingId);
        emit ListingDisabled(_listingId);
    }

    /**
    * @dev Retrieve total number of listings ever stored in the marketplace
    * @return Total number of listings
    */
    function getTotalListings() public view returns (uint) {
        uint total = marketStore.totalListings();
        return total;
    }

    /**
    * @dev Retrieves a list of all listings created by the given address
    * @param _seller User address to get all listings for
    * @return A list of all listing ids created by the user
    */
    function getAllSellerListings(address _seller) public view returns (uint[] memory) {
        return marketStore.getAllSellerListings(_seller);
    }

    /**
    * @dev Retrieves all information about a listing as a tuple. Note, the listing
    * status is returned as an integer: 0 = AVAILABLE, 1 = SOLD, 2 = INACTIVE
    * @param _id Id of listing
    * @return Listing id, price in wei, title, description, image reference,
    * seller address, status
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
        return (marketStore.getListing(_id));
    }

    /**
    * @dev Returns the selling price of the given listing id.
    * @param _id Id of listing
    * @return Listing price in Wei
    */
    function getListingPrice(uint _id) public view returns (uint) {
        return marketStore.getListingPrice(_id);
    }

    /**
    * @dev Returns the title of the given listing id.
    * @param _id Id of listing
    * @return Listing title
    */
    function getListingTitle(uint _id) public view returns (string memory) {
        return marketStore.getListingTitle(_id);
    }

    /**
    * @dev Returns the reference to the description of the given listing id
    * stored in a distributed database.
    * @param _id Id of listing
    * @return Listing description
    */
    function getListingDescription(uint _id) public view returns (string memory) {
        return marketStore.getListingDescription(_id);
    }

    /**
    * @dev Returns the reference to the image of the given listing id
    * stored in a distributed database.
    * @param _id Id of listing
    * @return Listing image reference
    */
    function getListingImage(uint _id) public view returns (string memory) {
        return marketStore.getListingImage(_id);
    }

    /**
    * @dev Returns the seller address of the given listing id.
    * @param _id Id of listing
    * @return Seller address
    */
    function getListingSeller(uint _id) public view returns (address) {
        return marketStore.getListingSeller(_id);
    }

    /**
    * @dev Returns the status of a listing as an integer:
    * 0 = AVAILABLE, 1 = SOLD, 2 = INACTIVE
    * @param _id Id of listing
    * @return Listing status
    */
    function getListingStatus(uint _id) public view returns (uint) {
        return marketStore.getListingState(_id);
    }

    /**
    * @dev Returns a list of all transactions involving the given user address
    * @param _user User address
    * @return List of transaction ids
    */
    function getAllUserTransactionIds(address _user) public view returns (uint[] memory) {
        return escrow.getAllUserTransactions(_user);
    }

    /**
    * @dev Returns all information about a transaction as a tuple. Note, the
    * transaction status is returned as an integer: 0 = AWAITING_PAYMENT,
    * 1 = AWAITING_DELIVERY, 2 = CONFIRMED
    * @param _id Id of the transaction
    * @return Transaction status, buyer address, seller address, transaction amount
    */
    function getTransaction(uint _id) public view returns (uint, address, address, uint) {
        return (escrow.getTransaction(_id));
    }

    /**
    * @dev Returns the status of the given transaction id as an integer:
    * 0 = AWAITING_PAYMENT, 1 = AWAITING_DELIVERY, 2 = CONFIRMED
    * @param _id Id of the transaction
    * @return Transaction status
    */
    function getTransactionStatus(uint _id) public view returns (uint) {
        return escrow.getTransactionStatus(_id);
    }

    /**
    * @dev Returns the buyer address of the given transaction id
    * @param _id Id of the transaction
    * @return Buyer address
    */
    function getTransactionBuyer(uint _id) public view returns (address) {
        return escrow.getTransactionBuyer(_id);
    }

    /**
    * @dev Returns the seller address of the given transaction id
    * @param _id Id of the transaction
    * @return Seller address
    */
    function getTransactionSeller(uint _id) public view returns (address) {
        return escrow.getTransactionSeller(_id);
    }

    /**
    * @dev Returns the amount of funds (to be) held in escrow of the given
    * transaction id
    * @param _id Id of the transaction
    * @return Transaction amount
    */
    function getTransactionAmount(uint _id) public view returns (uint) {
        return escrow.getTransactionAmount(_id);
    }

}
