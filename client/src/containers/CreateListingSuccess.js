import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Glyphicon } from "react-bootstrap";
import "./CreateListingSuccess.css";
import LinkButton from "../components/LinkButton";

export default class CreateListingSuccess extends Component {
  render() {
    return (
      <div className="CreateListingSuccess">
        <h1>Listing Success!</h1>
        <Glyphicon glyph="ok-circle" className="tick" />

        <p>Your item has been successfully listed in the marketplace!</p>

        <LinkContainer to="/mylistings">
          <LinkButton
            text="View Your Listings"
            bsSize="large"
          />
        </LinkContainer>

      </div>

    );
  }
}
