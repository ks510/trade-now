pragma solidity ^0.5.0;

/**
* @author Karen Suen
* @title A contract for managing trading of funds between buyers and sellers
* @notice This contract manages all transactions between buyers and sellers in the
* marketplace. When a buyer commits to purchasing a listing, a new transaction
* is created and buyer's purchase funds are held in this Escrow contract until
* the buyer confirms successful delivery of the item from seller. New transactions
* are started by creating a new Transaction struct and storing it in the map.
* Only 1 transaction per listing can be maintained at a time. Minimal safety
* checks are implemented here to avoid double payments or completing trades
* before payment is actually received in escrow.
*/
contract Escrow {

    enum Status {AWAITING_PAYMENT, AWAITING_DELIVERY, CONFIRMED} // {0,1,2}

    struct Transaction {
        Status status;
        address buyer;
        address seller;
        uint amount;
    }

    uint public totalTransactions = 0;
    mapping(uint => Transaction) public transactions;
    mapping(address => uint[]) public allUserTransactions;

    modifier isAwaitingPayment(uint _id) {
        require(
            transactions[_id].status == Status.AWAITING_PAYMENT,
            "Transaction is not awaiting payment"
        );
        _;
    }

    modifier isAwaitingDelivery(uint _id) {
        require(
            transactions[_id].status == Status.AWAITING_DELIVERY,
            "Transaction is not awaiting item delivery"
        );
        _;
    }

    /**
    * @dev Create a new transaction for the given listing, new transactions
    * always starts in AWAITING_PAYMENT.
    * @param _id The listing id that will be used for this transaction's id
    * @param _buyer The buyer address of the listing
    * @param _seller The seller address that created the listing
    * @param _amount The agreed selling price of listing
    */
    function startTransaction(
        uint _id,
        address _buyer,
        address _seller,
        uint _amount
    )
        public
    {
        transactions[_id] = Transaction(Status.AWAITING_PAYMENT, _buyer, _seller, _amount);
        totalTransactions++;

        // update the list of transactions involving the accounts
        allUserTransactions[_buyer].push(_id);
        allUserTransactions[_seller].push(_id);
    }

    /**
    * @dev Receives and holds buyer's funds for purchasing a listing and updates
    * the state of the corresponding transaction.
    * @param _id The transaction (listing) id to fund
    */
    function fundTransaction(uint _id) public payable isAwaitingPayment(_id) {
        transactions[_id].status = Status.AWAITING_DELIVERY;
    }

    /**
    * @dev Buyer confirms delivery of item from seller and escrow funds held
    * in this transaction is released to the seller. The transaction must be
    * in the correct state (AWAITING_DELIVERY) to be confirmed
    * @param _id Transaction id to confirm and release funds
    */
    function confirmItemReceived(uint _id) public isAwaitingDelivery(_id) {
        _releaseFundsToBuyer(_id);
        transactions[_id].status = Status.CONFIRMED;
    }

    /**
    * @dev Returns all information about a transaction as a tuple
    * @param _id Id of transaction to return
    */
    function getTransaction(uint _id) public view returns (uint, address, address, uint) {
        Transaction memory transaction = transactions[_id];
        return (
            uint256(transaction.status),
            transaction.buyer,
            transaction.seller,
            transaction.amount
        );
    }

    /**
    * @dev Return the list of all transaction ids involving the given account
    * @param _user The account address to retrieve all transactions for
    */
    function getAllUserTransactions(address _user) public view returns (uint[] memory) {
        return allUserTransactions[_user];
    }

    /**
    * @dev Return the buyer address of given transaction id
    * @param _id Transaction id to retrieve buyer address of
    */
    function getTransactionBuyer(uint _id) public view returns (address) {
        return transactions[_id].buyer;
    }

    /**
    * @dev Return the seller address of given transaction id
    * @param _id Transaction id to retrieve seller address of
    */
    function getTransactionSeller(uint _id) public view returns (address) {
        return transactions[_id].seller;
    }

    /**
    * @dev Return the agreed amount of the given transaction id
    * @param _id Transaction id to retrieve the agreed amount
    */
    function getTransactionAmount(uint _id) public view returns (uint) {
        return transactions[_id].amount;
    }

    /**
    * @dev Return the current status of the given transaction id
    * @param _id Transaction id to retrieve status of
    */
    function getTransactionStatus(uint _id) public view returns (uint) {
        return uint(transactions[_id].status);
    }

    // release payment to seller by transferring correct amount of funds from escrow contract
    function _releaseFundsToBuyer(uint _id) private {
        // must convert seller address to payable address to transfer funds
        address payable seller = address(uint160(transactions[_id].seller));
        seller.transfer(transactions[_id].amount);
    }

}
