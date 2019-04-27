import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Glyphicon } from "react-bootstrap";
import "./PurchaseSuccess.css";
import LinkButton from "../components/LinkButton";

export default class PurchaseSuccess extends Component {
  render() {
    return (
      <div className="PurchaseSuccess">
        <h1>Purchase Confirmed!</h1>
        <Glyphicon glyph="ok-circle" className="tick" />

        <p>Thank you for your purchase! </p>
        <p>Please remember to confirm delivery after receiving the item from the seller.</p>

        <LinkContainer to="/mypurchases">
          <LinkButton
            text="View Your Purchases"
            bsSize="large"
          />
        </LinkContainer>

      </div>

    );
  }
}
