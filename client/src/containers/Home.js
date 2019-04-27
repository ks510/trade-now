import React, { Component } from "react";
import { Image, Carousel, HelpBlock, Grid, Row, Col, Thumbnail } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import banner1 from "../images/banner1.jpg";
import banner2 from "../images/banner2.jpg";
import banner3 from "../images/banner3.jpg";
import LinkButton from "../components/LinkButton";
import "./Home.css";

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
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


  // get 3 most recent listings from contract and store in a list
  listings = async () => {
    // get total number of listings is marketplace
    const { contract } = this.props;
    const listings = [];
    const totalListings = await contract.methods.getTotalListings().call();

    // retrieve 3 most recent listings
    for (let i = totalListings; i > (totalListings-3) && i > 0; i--) {

      // get listing from contract and add to list
      const listing = await contract.methods.getListing(i).call();
      // convert wei to ether price for display
      const ethPrice = this.props.web3.utils.fromWei(listing[1]);
      listing[1] = ethPrice;

      listings.push(listing);

    }

    return listings;
  }

  // only show the title, preview image and price for each listing
  renderListingsCol = (listings) => {
    console.log(listings);
    return [{}].concat(listings).map(
      (listing, i) =>
        (i !== 0) && (listing[6] === "0")
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
    );
  }

  // show 3 most recent listings in the marketplace
  renderRecentListings = () => {
    return (
      <div className="recentListings">
        <Grid>
          <Row>
            {!this.state.isLoading && this.renderListingsCol(this.state.listings)}
          </Row>
        </Grid>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        <div className="lander">
          <Carousel>
            <Carousel.Item>
              <Image src={banner1} alt="banner 1" responsive />
            </Carousel.Item>
            <Carousel.Item>
              <Image src={banner2} alt="banner 2" responsive />
            </Carousel.Item>
            <Carousel.Item>
              <Image src={banner3} alt="banner 3" responsive />
            </Carousel.Item>
          </Carousel>
          <HelpBlock>Royalty free images sourced from www.pexels.com</HelpBlock>

          <h3>Recently listed for sale...</h3>
          <LinkContainer to="/marketplace"><a>See All Items</a></LinkContainer>
          {this.renderRecentListings()}
        </div>
      </div>
    );
  }
}
