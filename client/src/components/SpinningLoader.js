import React, { Component } from "react";
import { Glyphicon } from "react-bootstrap";
import "./SpinningLoader.css";

export class SpinningLoader extends Component {
  render() {
    const { loadingText } = this.props;
    return (
      <div className="SpinningLoader container">
        <Glyphicon glyph="refresh" className="spinning" />
        {loadingText ? loadingText : ""}
      </div>
    );
  }
}

export default SpinningLoader;
