import React, { Component } from "react";
import "./MyPurchases.css";

export default class MyPurchases extends Component {
  render() {
    return (
      <div className="MyPurchases container">
        <h1>My Purchases</h1>
        <p>Display all purchases made by this user</p>
      </div>
    );
  }
}
