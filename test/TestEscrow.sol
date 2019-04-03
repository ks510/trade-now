pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Escrow.sol";

/**
* @author Karen Suen
* @dev This contract tests the Escrow functions according to test checklist
*/
contract TestEscrow {

    function testEscrowInitializedCorrectly() public {
        Escrow escrow = Escrow(DeployedAddresses.Escrow());

        // check contract starts with 0 funds
        Assert.equal(address(escrow).balance, 0, "Escrow initial balance should be 0");
    }

    /**
    * @dev Adds a new transaction and checks it is created and store correctly
    */
    function testStartTransaction() public {
        Escrow escrow = Escrow(DeployedAddresses.Escrow());

        // create a new transaction
        uint listingId = 1;
        address buyer = address(this);
        address seller = address(0);
        uint amount = 1;
        escrow.startTransaction(listingId, buyer, seller, amount);

        // retrieve the transaction
        uint txStatus;
        address txBuyer;
        address txSeller;
        uint txAmount;
        (txStatus, txBuyer, txSeller, txAmount) = escrow.getTransaction(listingId);

        // check transaction is initialized correctly
        Assert.equal(txStatus, 0, "Initial status of transction should be AWAITING_PAYMENT");
        Assert.equal(buyer, buyer, "Buyer address should be this test contract");
        Assert.equal(seller, seller, "Seller address should be 0x000");
        Assert.equal(amount, amount, "Transaction amount not stored correctly");
        // check transaction count updated correctly
        uint transactionCount = escrow.transactionCount();
        Assert.equal(transactionCount, 1, "Transaction count not incremented");
    }

    /**
    * @dev Update transaction state to AWAITING_DELIVERY. Functionality of funding
    * transaction will be tested in market.js because these test contracts do
    * not have funds to send!
    */
    function testFundTransaction() public {
        Escrow escrow = Escrow(DeployedAddresses.Escrow());

        uint listingId = 1;
        address buyer = address(this);
        escrow.fundTransaction(listingId, buyer);

        // check transaction status was updated to AWAITING_DELIVERY = 1
        uint listingStatus = escrow.getTransactionStatus(1);
        Assert.equal(listingStatus, 1, "Transaction not updated to funded state");

    }
}
