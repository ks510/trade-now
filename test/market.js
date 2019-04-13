const Market = artifacts.require("./Market.sol");

contract("Market", accounts => {

  it("Market returns correct number of listings in market", async () => {
    const market = await Market.deployed();
    const totalTx = await market.getTotalListings();

    // check the correct event was emitted and market has 0 listings
    assert.equal(totalTx.logs.length, 1, "Event wasn't triggered");
    assert.equal(totalTx.logs[0].event, "TotalListings", "Incorrect event emitted");
    assert.equal(totalTx.logs[0].args.totalListings, 0, "Market should have 0 listings");
  });

  it("Successfully create and store new listing in market", async () => {
    const market = await Market.deployed();

    // create new listing in marketplace
    const price = 100;
    const title = "Wedding Dress";
    const desc = "Brand new";
    const image = "";
    const seller = accounts[0];
    const listingTx = await market.createListing(price, title, desc, image, { from: seller });

    // check the correct event was emitted and listing id returned in event
    assert.equal(listingTx.logs.length, 1, "Event wasn't triggered");
    assert.equal(listingTx.logs[0].event, "ListingCreated", "Incorrect event emitted");
    assert.equal(listingTx.logs[0].args.id, 1, "First listing id should be 1");
  });

});
