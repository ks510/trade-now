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

        uint id = 1;
        escrow.fundTransaction(id);

        // check transaction status was updated to AWAITING_DELIVERY = 1
        uint status = escrow.getTransactionStatus(1);
        Assert.equal(status, 1, "Transaction not updated to funded state");

    }

    /**
    * @dev Update transaction state to CONFIRMED. Functionality of releasing
    * funds to seller will be tested in market.js because these test contracts
    * do not have funds to exchange and test with!
    */
    function testConfirmTransaction() public {
      /*
        Escrow escrow = Escrow(DeployedAddresses.Escrow());

        // verify transaction is awaiting delivery status
        uint id = 1;
        uint status = escrow.getTransactionStatus(id);
        Assert.equal(status, 1, "Transaction not awaiting delivery");

        // update transaction to confirmed status and check it was updated
        escrow.confirmItemReceived(id);
        status = escrow.getTransactionStatus(id);
        // CONFIRMED = 2
        Assert.equal(status, 2, "Transaction was not confirmed");
      */
    }

    /**
    * @dev Checks transactions are associated with users correctly (both buyer
    * and seller)
    */
    function testGetAllUserTransactions() public {
        Escrow escrow = Escrow(DeployedAddresses.Escrow());

        // create 2 more transactions
        escrow.startTransaction(2, address(this), address(0), 100);
        escrow.startTransaction(3, address(this), address(0), 200);

        // check all user transaction ids are returned correctly
        uint[] memory myTransactions = escrow.getAllUserTransactions(address(this));
        for (uint i = 0; i < 3; i++) {
            Assert.equal(myTransactions[i], i + 1, "Incorrect transaction associated with user");
        }

        uint[] memory sellerTransactions = escrow.getAllUserTransactions(address(0));
        for (uint i = 0; i < 3; i++) {
            Assert.equal(sellerTransactions[i], i + 1, "Incorrect transaction associated with user");
        }
    }
}
