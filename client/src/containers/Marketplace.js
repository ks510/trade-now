import React, { Component } from "react";
import "./Marketplace.css";
import { LinkContainer } from "react-router-bootstrap";
import { Image, Grid, Row, Col, Thumbnail } from "react-bootstrap";
import LinkButton from "../components/LinkButton";
import SpinningLoader from "../components/SpinningLoader";

export default class Marketplace extends Component {

  constructor(props) {
    super(props);
    this.state = {
      totalListings: 0,
      listings: [],
      isLoading: false
    }
  }

  async componentDidMount() {
    // invoke method to retrieve listings in marketplace
    this.setState({ isLoading: true });
    try {
      const listings = await this.listings();
      this.setState({ listings, isLoading: false });
    } catch (error) {
      console.log(error);
    }
  }

  // get listings from contract and store in a list
  listings = async () => {
    // get total number of listings is marketplace
    const { contract } = this.props;
    const listings = [];
    const totalListings = await contract.methods.getTotalListings().call();

    // retrieve each listing and add to list
    for (let i = totalListings; i > 0; i--) {

      // get listing from contract and add to list
      const listing = await contract.methods.getListing(i).call();
      // convert wei to ether price for display
      const ethPrice = this.props.web3.utils.fromWei(listing[1]);
      listing[1] = ethPrice;

      listings.push(listing);
    }

    return listings;
  }


  renderListingsGrid = () => {
    return (
      <div className="listings">
        <Grid>
          <Row>
            {!this.state.isLoading && this.renderListingsCol(this.state.listings)}
          </Row>
        </Grid>
      </div>
    )
  }

  // only show the title, preview image and price for each listing
  renderListingsCol = (listings) => {
    return [{}].concat(listings).map(
      (listing, i) =>
        (i !== 0) && (listing[6] === "0")
          //console.log("Accessing listing", i, " ", listing);
          ? <Col sm={6} md={4} key={listing[0]}>
              <Thumbnail src="" style={{ minHeight: '400px', align: 'middle' }}>
                <Image
                  src={`https://ipfs.io/ipfs/${listing[4]}`}
                  alt="Preview"
                  style={{ height:'250px', width: '100%' }}
                />
                <h4>{listing[2]}</h4>
                <p>{listing[1]} ETH</p>
                <LinkContainer
                  key={listing[0]}
                  to={`/listing/${listing[0]}`}
                >
                  <LinkButton text="Buy Now" bsSize="large"/>
                </LinkContainer>
              </Thumbnail>
            </Col>
          : <br />

    )
  }

  render() {
    return (
      <div className="Marketplace">
        <h1>Marketplace</h1>
        <p>Viewing most recent listings...</p>
        {this.state.isLoading
          ? <SpinningLoader loadingText="Fetching all listings..." />
          : this.renderListingsGrid()
        }
      </div>
    );
  }
}
