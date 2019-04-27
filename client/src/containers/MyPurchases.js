import React, { Component } from "react";
import { ListGroup, ListGroupItem, Image, Label, Modal } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import LoaderButton from "../components/LoaderButton";
import LinkButton from "../components/LinkButton";
import SpinningLoader from "../components/SpinningLoader";
import RedButton from "../components/RedButton";
import "./MyPurchases.css";

export default class MyPurchases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      purchases: [],
      isLoadingPurchases: false,
      transactionId: null,
      showConfirmation: false,
      failed: false,
      isConfirming: false
    }
  }

  async componentDidMount() {

    this.setState({ isLoadingPurchases: true });

    // invoke method to retrieve listings in marketplace
    try {
      const purchases = await this.transactions();
      this.setState({ purchases, isLoadingPurchases: false });
    } catch (error) {
      console.log(error);
    }
  }

  transactions = async () => {
    // get all transactions involving this user
    const { accounts, contract, web3 } = this.props;
    const purchases = [];
    const txIds = await contract.methods.getAllUserTransactionIds(accounts[0]).call();

    // retrieve only buying transactions, most recent transactions first
    for (let i = txIds.length-1; i >= 0; i--) {

      const buyer = await contract.methods.getTransactionBuyer(txIds[i]).call();
      if (buyer === accounts[0]) {
        // fetch corresponding listing details for each buyer
        const listing = await contract.methods.getListing(txIds[i]).call();

        // convert wei to ether price for display
        const ethPrice = web3.utils.fromWei(listing[1]);
        listing[1] = ethPrice;

        // translate transaction status to useful string (AWAITING_DELIVERY (1) or COMPLETE (2))
        const txStatus = await contract.methods.getTransactionStatus(txIds[i]).call();
        switch (txStatus) {
          case "1":
            listing[7] = "AWAITING DELIVERY CONFIRMATION"; break;
          case "2":
            listing[7] = "COMPLETE"; break;
          default:
            listing[7] = "";
        }

        purchases.push(listing);
      }
    }

    return purchases;
  }

  confirmDelivery = async () => {
    this.setState({ isConfirming: true });
    const { transactionId } = this.state;
    const { accounts, contract } = this.props;

    //  use transaction id to confirm delivery in contract to trigger funds release to seller
    try {
      await contract.methods.confirmItemReceived(transactionId).send({ from: accounts[0] });
      this.props.history.push("/deliveryconfirmed");

    } catch (error) {
      this.setState({ failed: true });
      console.log(error);
    }

    this.setState({ isConfirming: false });
  }

  // show modal confirmation pop up
  showConfirmationPopup = (transactionId) => {
    this.setState({ showConfirmation: true, transactionId });
  }

  // hide model confirmation pop up
  closeConfirmationPopup = () => {
    this.setState({ showConfirmation: false, failed: false });
  }

  labelColour = (status) => {
    switch (status) {
      case "AWAITING DELIVERY CONFIRMATION":
        return "danger";
      case "COMPLETE":
        return "success";
      default:
        return null;
    }
  }

  // only show the title, preview image and price for each purchase
  renderPurchasesList = (purchases) => {
    return [{}].concat(purchases).map(
      (purchase, i) =>
        i !== 0
          ? <ListGroupItem header={purchase[2]} key={i}>
              <Image src={`https://ipfs.io/ipfs/${purchase[4]}`}
                width={100}
                responsive
                style={{ height:'100px' }} />
              {"Price: " + purchase[1] + " ETH"}
              <br />
              {"Description: " + purchase[3].split("\n")[0].substring(0,100).concat("...")}
              <br />
              {"Status: "} <Label bsStyle={this.labelColour(purchase[7])}>{purchase[7]}</Label>
              <br />
              <div className="buttons">
                <LoaderButton
                  text="Confirm Delivery"
                  loadingText="Confirming Delivery..."
                  disabled={purchase[7] !== "AWAITING DELIVERY CONFIRMATION"}
                  isLoading={this.state.isConfirming}
                  onClick={() => this.showConfirmationPopup(purchase[0])}

                />
                {" "}
                <LinkContainer
                  key={purchase[0]}
                  to={`/listing/${purchase[0]}`}
                >
                  <LinkButton text="View Original Listing" />
                </LinkContainer>
              </div>
            </ListGroupItem>
          : null

    );
  }

  render() {
    return (
      <div className="MyPurchases">
        <h1>My Purchases</h1>
        <p>Showing most recent purchases first</p>
        <div className="purchases">
          <ListGroup>
            {this.state.isLoadingPurchases
              ? <SpinningLoader loadingText="Loading your purchases..." />
              : this.renderPurchasesList(this.state.purchases)
            }
          </ListGroup>
        </div>
        <Modal show={this.state.showConfirmation} onHide={this.closeConfirmationPopup}>
          <Modal.Header>
            <Modal.Title>Confirm Delivery</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!this.state.failed
              ? <p>Are you sure you want confirm delivery of this item? This will complete
                the trade and cannot be undone.</p>
              : <p>Unable to confirm delivery of the item, please try again.</p>
            }
          </Modal.Body>
          <Modal.Footer>
            {!this.state.failed
              ? <>
                  <LoaderButton
                    text="Confirm"
                    loadingText="Confirming Delivery..."
                    isLoading={this.state.isConfirming}
                    onClick={this.confirmDelivery}
                  />
                  <RedButton
                    text="Cancel"
                    onClick={this.closeConfirmationPopup}
                  />
                </>
              : <LinkButton
                  text="OK"
                  onClick={this.closeConfirmationPopup}
                />
              }

          </Modal.Footer>
        </Modal>
      </div>
    );
  }

}
