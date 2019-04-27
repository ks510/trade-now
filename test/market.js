const Market = artifacts.require("./Market.sol");
const Escrow = artifacts.require("./Escrow.sol");

contract("Market", accounts => {
  // price should be handled in wei/int for precision with javascript client
  const price1 = 100;
  const title1 = "Wedding Dress";
  const desc1 = "Brand new";
  const image1 = "";
  const seller = accounts[0];

  it("Market initally has 0 listings", async () => {
    const market = await Market.deployed();

    const total = await market.getTotalListings.call();
    assert.equal(total, 0, "Total listings in market should be 0");

  });

  it("Successfully create and store new listing in market", async () => {
    const market = await Market.deployed();

    // create new listing in marketplace
    const listingTx = await market.createListing(price1, title1, desc1, image1, { from: seller });

    // check the correct event was emitted and listing id returned in event
    assert.equal(listingTx.logs.length, 1, "Event wasn't triggered");
    assert.equal(listingTx.logs[0].event, "ListingCreated", "Incorrect event emitted");
    assert.equal(listingTx.logs[0].args.id, 1, "First listing id should be 1");
  });

  it("Retrieves a listing in the market", async () => {
    const market = await Market.deployed();

    // retrieve existing listing in the marketplace
    const listing = await market.getListing.call(1);
    assert.equal(listing[0], 1, "Incorrect listing id");
    assert.equal(listing[1], price1, "Incorrect listing price1");
    assert.equal(listing[2], title1, "Incorrect listing title1");
    assert.equal(listing[3], desc1, "Incorrect listing desc1");
    assert.equal(listing[4], image1, "Incorrect listing image1");
    assert.equal(listing[5], seller, "Incorrect listing seller");
  });

  it("Retrieves each listing detail from the market correctly", async () => {
    const market = await Market.deployed();

    // retrieve listing details using separate methods
    const listingPrice = await market.getListingPrice.call(1);
    const listingTitle = await market.getListingTitle.call(1);
    const listingDescription = await market.getListingDescription.call(1);
    const listingImage = await market.getListingImage.call(1);
    const listingSeller = await market.getListingSeller.call(1);
    const listingState = await market.getListingStatus.call(1);

    assert.equal(listingPrice, price1, "Retrieved incorrect listing price");
    assert.equal(listingTitle, title1, "Retrieved incorrect listing title");
    assert.equal(listingDescription, desc1, "Retrieved incorrect listing description");
    assert.equal(listingImage, image1, "Retrieved incorrect listing image hash");
    assert.equal(listingSeller, seller, "Retrieved incorrect listing seller");
    assert.equal(listingState, 0, "Listing state should be AVAILABLE (0)");
  });

  it("Buying a listing", async () => {
    const market = await Market.deployed();
    const escrow = await Escrow.deployed();
    let escrowBalance = await web3.eth.getBalance(escrow.address);

    // market initially has 0 funds (no listing purchases made yet)
    assert.equal(escrowBalance, 0, "Market should not have any funds yet");

    // verify listing is in AVAILABLE state
    let status = await market.getListingStatus.call(1);
    assert.equal(status, 0, "Listing should be AVAILABLE state");

    // purchase the listing in market
    const purchaseTx = await market.buyListing(1, { value: price1, from: accounts[1] });
    // check transaction was started in escrow contract
    const tx = await escrow.getTransaction.call(1);
    assert.equal(tx[0], 1, "Transaction status should be AWAITING_DELIVERY (1)");
    assert.equal(tx[1], accounts[1], "Incorrect buyer address in transaction");
    assert.equal(tx[2], seller, "Incorrect seller address in transaction");
    assert.equal(tx[3], price1, "Transaction amount doesn't match listing price");

    // check escrow contract received the payment and funded transaction
    escrowBalance = await web3.eth.getBalance(escrow.address);
    assert.equal(escrowBalance, price1, "Escrow didn't receive payment");

    // check listing status is updated to SOLD
    status = await market.getListingStatus.call(1);
    assert.equal(status, 1, "Listing state not updated to SOLD");

    // converting decimal ether amount to wei
    //const number = await web3.utils.toWei("1.5", 'ether');
    //console.log(number);
  });

  it("Retrieving transaction details", async () => {
    const market = await Market.deployed();

    // get details of transaction/listing id 1 using separate methods
    const txPrice = await market.getTransactionAmount.call(1);
    const txSeller = await market.getTransactionSeller.call(1);
    const txBuyer = await market.getTransactionBuyer.call(1);
    const txStatus = await market.getTransactionStatus.call(1);

    assert.equal(txPrice, price1, "Transaction amount doesn't match listing price");
    assert.equal(txSeller, seller, "Transaction seller is incorrect");
    assert.equal(txBuyer, accounts[1], "Transaction buyer is incorrect");
    assert.equal(txStatus, 1, "Transaction status should be SOLD (1)");
  });

  it("Confirming delivery of a purchase", async () => {
    const market = await Market.deployed();
    const escrow = await Escrow.deployed();
    let escrowBalance1 = await web3.eth.getBalance(escrow.address);
    let sellerBalance1 = await web3.eth.getBalance(seller);
    console.log("Escrow balance before confirm: ", escrowBalance1);
    console.log("Seller balance before confirm: ", sellerBalance1);

    await escrow.confirmItemReceived(1, { from: accounts[1] });

    let escrowBalance2 = await web3.eth.getBalance(escrow.address);
    let sellerBalance2 = await web3.eth.getBalance(seller);
    console.log("Escrow balance after confirm: ", escrowBalance2);
    console.log("Seller balance after confirm: ", sellerBalance2);
    assert.equal(escrowBalance2, escrowBalance1 - price1, "Escrow did not release funds to seller");
  });


});
