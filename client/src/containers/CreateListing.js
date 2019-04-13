import React, { Component } from "react";
import getWeb3 from "../utils/getWeb3";
import {
  InputGroup,
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel,
  Checkbox,
  Image
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import "./CreateListing.css";

class CreateListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listingPrice: 0,
      listingTitle: "",
      listingDescription: "",
      imageIPFS: "",
      imageBuffer: null,
      preview: null,
      confirmDetails: false,
      isLoading: false
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleChangeCheckbox = event => {
    this.setState({
      [event.target.id]: event.target.checked
    });
  }

  // this method is called whenever a file is uploaded
  // gets uploaded file and converts it to appropriate format for IPFS
  // stores the file in this component's state
  captureFile = (event) => {
    event.preventDefault();

    const file = event.target.files[0]; // access file from user input

    if (file) {
      // update preview state
      this.setState({ preview: URL.createObjectURL(file) });

      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file); // convert file to array for buffer
      // after reader finishes, initialise buffer and store in component state
      reader.onloadend = () => {
        this.setState({ imageBuffer: Buffer(reader.result) });

        console.log('buffer', this.state.imageBuffer); // console should log uint8array...
      }
    }
  }

  validateForm = () => {
    return (
      this.state.listingTitle.length > 0 &&
      this.state.listingPrice > 0 &&
      this.state.listingDescription.length > 50 && // at least 50 characters
      this.state.preview != null &&
      this.state.confirmDetails == true
    );
  }

  submitListing = (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });

    // send transaction to contract to store new listing
  }

  //TODO: verify fields not null

  render() {
    return (
      <div className="CreateListing">
        <h1>List an item!</h1>
        <p>Please enter the details of your listing below.</p>

        <form onSubmit={this.submitListing}>
          <FormGroup controlId="listingTitle" bsSize="large">
            <ControlLabel>Title of your listing</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.title}
              onChange={this.handleChange}
              placeholder="Please enter a title for your listing"
            />
          </FormGroup>

          <FormGroup controlId="listingImage" bsSize="large">
            <ControlLabel>Upload a photo of your item</ControlLabel>
            <FormControl
              type="file"
              onChange={this.captureFile}
              help="Use a clear photograph of your item!"
            />
            <Image src={this.state.preview} width={300} height={300} responsive />
          </FormGroup>

          <div className="listingPrice">
          <FormGroup controlId="listingPrice" bsSize="large">
            <ControlLabel>Selling Price</ControlLabel>
            <InputGroup>
              <FormControl
                type="number"
                value={this.state.price}
                onChange={this.handleChange}
                placeholder="Ether"
              />
              <InputGroup.Addon>ETH</InputGroup.Addon>
            </InputGroup>
          </FormGroup>
          </div>

          <FormGroup controlId="listingDescription">
            <ControlLabel>Description</ControlLabel>
            <FormControl
              componentClass="textarea"
              value={this.state.listingDescription}
              onChange={this.handleChange}
              placeholder="Include more details about the item such as specification, measurements, condition etc."
            />
          </FormGroup>
          <FormGroup controlId="confirmDetails" validationState={this.state.confirmDetails}>
            <Checkbox
              id="confirmDetails"
              checked={this.state.confirmDetails}
              onChange={this.handleChangeCheckbox}
              title="confirmDetails">
              I have checked the details of my listing and confirm they are correct.
            </Checkbox>
          </FormGroup>

          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Submit Listing"
            loadingText="Submitting listing..."
          />
        </form>
      </div>
    )
  }
}

export default CreateListing;
