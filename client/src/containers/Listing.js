import React, { Component } from "react";
import "./Listing.css";
import { Image, FormGroup, FormControl, Checkbox, Label } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import LoaderButton from "../components/LoaderButton";
import SpinningLoader from "../components/SpinningLoader";
import ipfs from '../ipfs';

export default class Listing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      title: "",
      weiPrice: 0,
      description: "",
      image: "",
      seller: null,
      status: 0,
      confirmCheckbox: false,
      isLoadingPage: false,
      isLoading: false,
      ethPrice: 0,
    };
  }

  async componentDidMount() {
    this.setState({ isLoadingPage: true });

    // fetch listing details from contract using id
    const { contract } = this.props;
    const listing = await contract.methods.getListing(this.state.id).call();
    // convert wei price back to ether price
    const ethPrice = this.props.web3.utils.fromWei(listing[1]);
    this.setState({
      weiPrice: listing[1],
      title: listing[2],
      description: listing[3],
      image: listing[4],
      seller: listing[5],
      status: listing[6],
      ethPrice,
      isLoadingPage: false
    });
  }

  handleChangeCheckbox = event => {
    this.setState({
      [event.target.id]: event.target.checked
    });
  }

  validatePurchase = () => {
    const { accounts } = this.props;

    // check the user is not the seller of the listing
    return accounts[0] !== this.state.seller;
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    const { accounts, contract } = this.props;

    // safety checks before allowing purchase
    if (this.validatePurchase()) {

      // send payment and start transaction to purchase listing
      try {
        const result = await contract.methods.buyListing(this.state.id).send({ from: accounts[0], value: this.state.weiPrice });
        // go to purchase success page
        this.props.history.push("/purchasesuccess");

      } catch (error) {
        console.error(error);
        this.setState({ isLoading: false });
      }
    } else {
      // change this to modal pop up
      alert("Cannot purchase your own listings!");
      this.setState({ isLoading: false });
    }


  }

  statusLabelText = () => {
    switch(this.state.status) {
      case "1":
        return "SOLD";
      case "2":
        return "DISABLED";
      default:
        return "";
    }
  }

  renderListing = () => {
    return (
      <div className="listingDetails">
        <h1>{this.state.title}</h1>
        <div className="Image">
          <Image src={`https://ipfs.io/ipfs/${this.state.image}`} responsive />
        </div>
        <h3>Price: {this.state.ethPrice} ETH</h3>
        <br />
        <h4>Description:</h4>
        <div className="description">
          <FormControl
            componentClass="textarea"
            value={this.state.description}
            rows={this.state.description.split("\n").length+1}
          />
        </div>
        {this.state.status === "0"
          ? <form onSubmit={this.onSubmit}>
              <FormGroup controlId="confirmCheckbox">
                <Checkbox
                  id="confirmCheckbox"
                  checked={this.state.confirmCheckbox}
                  onChange={this.handleChangeCheckbox}
                  title="confirmCheckbox">
                  I have read the listing details and confirm I wish to purchase this item.
                </Checkbox>
              </FormGroup>
              <LoaderButton
                type="submit"
                text="Buy Item & Send Payment"
                loadingText="Sending Payment..."
                bsSize="large"
                disabled={!this.state.confirmCheckbox}
                isLoading={this.state.isLoading}
              />
            </form>
          : <h2><Label bsStyle="danger">{this.statusLabelText()}</Label></h2>
        }

        {!this.state.isLoading
          ? <LinkContainer to="/marketplace"><a>Back to Marketplace</a></LinkContainer>
          : <br />
        }
      </div>
    );
  }

  render() {
    // use listing id to retrieve full details of listing
    return (
      <div className="Listing">
        {this.state.isLoadingPage
          ? <SpinningLoader loadingText="Fetching listing details..." />
          : this.renderListing()
        }
      </div>
    );
  }
}
