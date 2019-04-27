import React from "react";
import { Button } from "react-bootstrap";
import "./LinkButton.css";

export default ({
  text,
  className = "",
  disabled = false,
  ...props
}) =>
  <Button
    className={`LinkButton ${className}`}
    disabled={disabled}
    {...props}
  >
    {text}
  </Button>;
