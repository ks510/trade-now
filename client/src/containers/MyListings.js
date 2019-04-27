import React, { Component } from "react";
import { ListGroup, ListGroupItem, Image, Label, Modal, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import LoaderButton from "../components/LoaderButton";
import LinkButton from "../components/LinkButton";
import RedButton from "../components/RedButton";
import SpinningLoader from "../components/SpinningLoader";
import "./MyListings.css";

export default class MyListings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listings: [],
      isLoadingListings: false,
      isDisabling: false,
      showConfirmation: false,
      failed: false,
      id: null
    }
  }

  async componentDidMount() {

    this.setState({ isLoadingListings: true });

    // invoke method to retrieve seller listings in marketplace
    try {
      const listings = await this.getListings();
      this.setState({ listings, isLoadingListings: false });
    } catch (error) {
      console.log(error);
    }
  }

  // get listings from contract and store in a list
  getListings = async () => {
    // get all listings involving this user
    const { accounts, contract, web3 } = this.props;
    const listings = [];
    const listingIds = await contract.methods.getAllSellerListings(accounts[0]).call();


    // retrieve all listing details using list of ids, most recent listing first
    for (let i = listingIds.length-1; i >= 0; i--) {

      // fetch corresponding listing details for each id
      const listing = await contract.methods.getListing(listingIds[i]).call();

      // convert wei to ether price for display
      const ethPrice = web3.utils.fromWei(listing[1]);
      listing[1] = ethPrice;

      // translate listing status to useful string
      const listingStatus = listing[6]
      switch (listingStatus) {
        case "0":
          listing[6] = "AVAILABLE"; break;
        case "1":
          listing[6] = "SOLD"; break;
        case "2":
          listing[6] = "DISABLED"; break;
        default:
          listing[6] = "";
        }

      listings.push(listing);
    }

    return listings;
  }

  // user confirms delivery
  disableListing = async () => {
    this.setState({ isDisabling: true });

    const { accounts, contract } = this.props;
    const listingId = this.state.id;

    // check the user is the seller of the listing
    const seller = await contract.methods.getListingSeller(listingId).call();
    if (seller === accounts[0]) {

      // use listing id to disable listing status in contract
      try {
        await contract.methods.disableListing(listingId).send({ from: accounts[0] });
        this.props.history.push("/listingdisabled");

      } catch (error) {
        this.setState({ failed: true });
        console.log(error);
      }
    } else {
      alert("Only the seller of the listing can disable it!");
    }

    this.setState({ isDisabling: false });

  }

  labelColour = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "success";
      case "SOLD":
        return "danger";
      case "DISABLED":
        return "warning";
      default:
        return null;
    }
  }

  // popup confirmation box for disabling listing
  showConfirmationPopup = (id) => {
    this.setState({ showConfirmation: true, id });
  }

  closeConfirmationPopup = () => {
    this.setState({ showConfirmation: false, failed: false });
  }

  // only show the title, preview image and price for each listing
  renderListingsList = (listings) => {
    return [{}].concat(listings).map(
      (listing, i) =>
        i !== 0
          //console.log("Accessing listing", i, " ", listing);
          ? <ListGroupItem header={listing[2]} key={i}>
              <Image src={`https://ipfs.io/ipfs/${listing[4]}`}
                width={100}
                responsive
                style={{ height:'100px' }}
              />
              {"Price: " + listing[1] + " ETH"}
              <br />
              {"Description: " + listing[3].split("\n")[0].substring(0,100).concat("...")}
              <br />
              {"Status: "} <Label bsStyle={this.labelColour(listing[6])}>{listing[6]}</Label>
              <br />
              <div className="buttons">
                <LoaderButton
                  text="Disable Listing"
                  loadingText="Disabling Listing..."
                  disabled={(listing[6] !== "AVAILABLE")}
                  isLoading={this.state.isDisabling}
                  type="submit"
                  onClick={() => this.showConfirmationPopup(listing[0])}
                />
                {" "}
                <LinkContainer
                  key={listing[0]}
                  to={`/listing/${listing[0]}`}
                >
                  <LinkButton text="View Listing" />
                </LinkContainer>
              </div>
            </ListGroupItem>
          : null

    );
  }

  render() {
    return (
      <div className="MyListings">
        <h1>My Listings</h1>
        <p>Showing all listings created by this user, most recent listings at the top.</p>
        <div className="listings">
          <ListGroup>
            {this.state.isLoadingListings
              ? <SpinningLoader loadingText="Loading your listings..." />
              : this.renderListingsList(this.state.listings)
            }
          </ListGroup>
        </div>

        <Modal show={this.state.showConfirmation} onHide={this.closeConfirmationPopup}>
          <Modal.Header>
            <Modal.Title>Disable Listing</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!this.state.failed
              ? <p>Are you sure you want to disable this listing? The listing will
                no longer be visible in the marketplace.</p>
              : <p>Listing was not disabled, please try again.</p>
            }
          </Modal.Body>
          <Modal.Footer>
            {!this.state.failed
              ? <>
                  <LoaderButton
                    text="Confirm"
                    loadingText="Disabling Listing..."
                    isLoading={this.state.isDisabling}
                    onClick={this.disableListing}
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
