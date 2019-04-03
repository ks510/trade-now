pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MarketStore.sol";

/**
* @author Karen Suen
* @dev This contract tests the MarketStore functions according to test checklist
*/
contract TestMarketStore {

    function testMarketStoreInitializedCorrectly() public {
        MarketStore market = MarketStore(DeployedAddresses.MarketStore());

        // test the market store initially has 0 listings
        uint totalListings = market.totalListings();
        Assert.equal(totalListings, 0, "Market store should start with 0 listings");
    }

    /**
    * @dev Test creating a new listing is stored correctly and can be retrieved
    */
    function testCreateAndRetrieveListing() public {
        MarketStore market = MarketStore(DeployedAddresses.MarketStore());

        // create the listing in marketplace
        uint price = 100;
        string memory title = "Teddy Bear";
        string memory desc = "Brand new soft toy with tags";
        string memory image = ""; // this value should be ipfs hash
        address seller = address(this); // this test contract is creating this listing
        uint generatedId = market.createListingInStore(price, title, desc, image, seller);
        // check returned listing id is correct for first listing
        Assert.equal(generatedId, 1, "Listing id generated incorrectly");

        // retrieve listing and check it is stored and initalising correctly
        uint listingId;
        uint listingPrice;
        string memory listingTitle;
        string memory listingDesc;
        string memory listingImage;
        address listingSeller;
        uint listingState;

        (
          listingId,
          listingPrice,
          listingTitle,
          listingDesc,
          listingImage,
          listingSeller,
          listingState
        ) = market.getListing(generatedId);

        Assert.equal(listingId, generatedId, "Listing id should be 1");
        Assert.equal(listingPrice, price, "Listing price is stored incorrectly");
        Assert.equal(listingTitle, title, "Listing title is stored incorrectly");
        Assert.equal(listingDesc, desc, "Listing description is stored incorrectly");
        Assert.equal(listingImage, image, "Listing image is stored incorrectly");
        Assert.equal(listingSeller, seller, "Listing seller address is stored incorrectly");
        // ListingState.AVAILABLE = 0
        Assert.equal(
          listingState,
          0,
          "Listing state was not initialized correctly - expected AVAILABLE"
        );

    }

    /**
    * @dev Continuation of checking the store was updated correctly, separated
    * due to stack too deep error (too many local variables in above method)
    */
    function testCreateAndRetrieveListingPart2() public {
        MarketStore market = MarketStore(DeployedAddresses.MarketStore());

        // check listing count is updatedly correctly
        uint expectedListingCount = 1;
        uint listingCount = market.totalListings();
        Assert.equal(listingCount, expectedListingCount, "There should be 1 listing in the market");

        // check this account's list of listings is updated
        uint[] memory myListingIds = market.getAllSellerListings(address(this));
        Assert.equal(myListingIds[0], 1, "This address list of listings was not updated");
    }

    /**
    * @dev Check listing ids are unique and generated correctly
    */
    function testListingIdGeneration() public {
        MarketStore market = MarketStore(DeployedAddresses.MarketStore());

        // create second listing
        uint generatedId2 = market.createListingInStore(
          200,
          "Leather Coat",
          "Mint condition",
          "",
          address(this)
        );
        Assert.equal(generatedId2, 2, "The second listing should have id = 2");

        // create third listing
        uint generatedId3 = market.createListingInStore(
          300,
          "Sunglasses",
          "Worn a few times",
          "",
          address(this)
        );
        Assert.equal(generatedId3, 3, "The third listing should have id = 3");

    }

    /**
    * @dev Check current listing count in market store is correct
    */
    function testTotalListingCount() public {
        MarketStore market = MarketStore(DeployedAddresses.MarketStore());

        // create fourth listing and check total listings is 4
        market.createListingInStore(200, "Leather Coat", "Mint condition", "", address(this));
        uint totalListings = market.totalListings();
        Assert.equal(totalListings, 4, "There should be 4 listings stored");
    }

    function testRetrieveAllSellerListingIds() public {
        MarketStore market = MarketStore(DeployedAddresses.MarketStore());

        address seller = address(this);
        uint[] memory myListings = market.getAllSellerListings(seller);
        // first 4 listings created in marketplace belong to this account (id 1-4);
        // listing ids indexing starts at 1
        for (uint i = 0; i < myListings.length; i++) {
            Assert.equal(myListings[i], i + 1, "Incorrect listing owned by this account");
        }
    }

    function testDisableListing() public {
        MarketStore market = MarketStore(DeployedAddresses.MarketStore());

        uint id = 1; // teddy bear listing
        market.disableListing(id);

        uint state; // listing state enum value is converted to integer
        (,,,,,,state) = market.getListing(id);

        uint inactiveState = 2; // equivalent to ListingState.INACTIVE
        Assert.equal(state, inactiveState, "Listing was not disabled");

    }

    function testSellingListing() public {
        MarketStore market = MarketStore(DeployedAddresses.MarketStore());

        uint id = 2; // leather coat listing
        market.listingSold(id);

        uint state; // listing state enum value is converted to integer
        state = market.getListingState(id);
        //(,,,,,,state) = market.getListing(id);

        uint soldState = 1; // equivalent to ListingState.SOLD
        Assert.equal(state, soldState, "Listing was not sold");
    }
}
