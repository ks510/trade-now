import React, { Component } from "react";
import "./Help.css";

export default class Help extends Component {

  renderGuides = () => {
    
  }

  renderFaqs = () => {

  }

  render() {
    return (
      <div className="Help">
        <h1>Help & FAQs</h1>
        <p>Frequently Asked questions and guides on how to use the marketplace.</p>
        {this.renderFaqs()}
        {this.renderGuides()}
      </div>
    );
  }
}
