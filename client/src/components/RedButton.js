import React from "react";
import { Button } from "react-bootstrap";
import "./RedButton.css";

export default ({
  text,
  className = "",
  disabled = false,
  ...props
}) =>
  <Button
    className={`RedButton ${className}`}
    disabled={disabled}
    bsStyle="danger"
    {...props}
  >
    {text}
  </Button>;
