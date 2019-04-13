import React, { Component } from "react";
import "./MyListings.css";

export default class MyListings extends Component {
  render() {
    return (
      <div className="MyListings container">
        <h1>My Listings</h1>
        <p>Display all listings created by this user</p>
      </div>
    );
  }
}
