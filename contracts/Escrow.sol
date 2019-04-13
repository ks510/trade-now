pragma solidity ^0.5.0;

/**
* @author Karen Suen
* @title A contract for managing trading of funds between buyers and sellers
* @notice This contract manages all transactions between buyers and sellers in the
* marketplace. When a buyer commits to purchasing a listing, a new transaction
* is created and buyer's purchase funds are held in this Escrow contract until
* the buyer confirms successfully delivery of the item from seller.
* New transactions are started by creating a new Transaction struct. Transactions
* are identified using the listing id and each listing can only have 1 ongoing
* transaction at a time.
*/
contract Escrow {

    enum Status {AWAITING_PAYMENT, AWAITING_DELIVERY, CONFIRMED}

    struct Transaction {
        Status status;
        address buyer;
        address seller;
        uint amount;
    }

    uint public transactionCount = 0;
    mapping(uint => Transaction) public transactions;
    mapping(address => uint[]) public allUserTransactions;


    modifier buyerOnly(uint _id, address _buyer) {
        require(
            transactions[_id].buyer == _buyer,
            "Only the buyer of this transaction can call this method"
        );
        _;
    }

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
    * always starts in AWAITING_PAYMENT state.
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
        transactionCount++;
        // update the list of transactions involving the accounts
        allUserTransactions[_buyer].push(_id);
        allUserTransactions[_seller].push(_id);
    }

    /**
    * @dev Receives and holds buyer's funds for purchasing a listing and updates
    * the state of the corresponding transaction.
    * @param _id The transaction (listing) id to fund
    * @param _buyer The buyer address that is sending the funds
    */
    function fundTransaction(uint _id, address _buyer)
        public
        payable
        isAwaitingPayment(_id)
        buyerOnly(_id, _buyer)
    {
        transactions[_id].status = Status.AWAITING_DELIVERY;
    }

    /**
    * @dev Buyer confirms delivery of item from seller and escrow funds held
    * in this transaction is released to the seller. The transaction must be
    * in the correct state (AWAITING_DELIVERY) to be confirmed
    * @param _id Transaction id to confirm and release funds
    */
    function confirmItemReceived(uint _id)
        public
        isAwaitingDelivery(_id)
    {
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
    function getAllUserTransactions(address _user) public view returns (uint256[] memory) {
        return allUserTransactions[_user];
    }

    /**
    * @dev Return the current status of the given transaction id
    * @param _id Transaction id to retrieve status of
    */
    function getTransactionStatus(uint _id) public view returns (uint) {
        return uint(transactions[_id].status);
    }

    function getTransactionBuyer(uint _id) public view returns (address) {
      return transactions[_id].buyer;
    }

    function getTransactionSeller(uint _id) public view returns (address) {
      return transactions[_id].seller;
    }

    function getTransactionAmount(uint _id) public view returns (uint) {
      return transactions[_id].amount;
    }

    // release payment to seller of the transaction
    // must convert seller address to payable address
    function _releaseFundsToBuyer(uint _id) private {
        address payable seller = address(uint160(transactions[_id].seller));
        seller.transfer(transactions[_id].amount);
    }

}
