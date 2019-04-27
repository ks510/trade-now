import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Glyphicon } from "react-bootstrap";
import "./ListingDisabled.css";
import LinkButton from "../components/LinkButton";

export default class ListingDisabled extends Component {
  render() {
    return (
      <div className="ListingDisabled">
        <h1>Listing Disabled!</h1>
        <Glyphicon glyph="ok-circle" className="tick" />

        <p>You have successfully disabled the listing in the marketplace.</p>
        <p>Disabled listings will no longer be available in the marketplace.</p>

        <LinkContainer to="/mylistings">
          <LinkButton
            text="Back To My Listings"
            bsSize="large"
          />
        </LinkContainer>

      </div>

    );
  }
}
