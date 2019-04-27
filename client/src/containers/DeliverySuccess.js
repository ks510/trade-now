import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Glyphicon } from "react-bootstrap";
import "./DeliverySuccess.css";
import LinkButton from "../components/LinkButton";

export default class DeliverySuccess extends Component {
  render() {
    return (
      <div className="DeliverySuccess">
        <h1>Delivery Confirmation Success!</h1>
        <Glyphicon glyph="ok-circle" className="tick" />
        
        <p>You have successfully confirmed delivery of the item from the seller.</p>
        <p>The trade is now complete, thank you for your purchase!</p>

        <LinkContainer to="/mypurchases">
          <LinkButton
            text="Back To My Purchases"
            bsSize="large"
          />
        </LinkContainer>

      </div>

    );
  }
}
