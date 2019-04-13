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
import ipfs from '../ipfs';

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

    // check a file was actually uploaded
    if (file) {
      // check file size doesn't exceed limit
      if (this.validateFileSize(file.size)) {

        // update preview state
        this.setState({ preview: URL.createObjectURL(file) });

        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file); // convert file to array for buffer
        // after reader finishes, initialise buffer and store in component state
        reader.onloadend = () => {
          this.setState({ imageBuffer: Buffer(reader.result) });

          //console.log('buffer', this.state.imageBuffer); // console should log uint8array...
        }
      }
    }
  }

  // check if file size is less than 5MB or some limit
  validateFileSize = (size) => {
    return size < 5000000;
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

  submitListing = async (event) => {
    console.log("submitting listing...");
    event.preventDefault();
    this.setState({ isLoading: true });

    await this.uploadFileToIPFS();

    // send transaction to contract to store new listing
    const { accounts, contract } = this.props;
    console.log(accounts[0]);
    console.log(contract);
    const result = await contract.methods.createListing(
      this.state.listingPrice,
      this.state.listingTitle,
      this.state.listingDescription,
      this.state.imageIPFS
    ).send({ from: accounts[0] });
    console.log(result.events);

    //this.setState({ isLoading: false });

    // go to listing success page
    this.props.history.push("/createlistingsuccess");
  }

  uploadFileToIPFS = async (event) => {
    console.log("uploading image to IPFS...");
    // post file to IPFS, get the IPFS hash and store it in contract
    try {
      let results = await ipfs.add(this.state.imageBuffer);
      let ipfsHash = results[0].hash;
      console.log(ipfsHash);
      // store generated iPFS hash in state
      this.setState({ imageIPFS: ipfsHash });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

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
              accept=".png,.jpg,.jpeg"
              onChange={this.captureFile}
            />
            <FormControl.Feedback />
            <HelpBlock>Use a clear photograph of your item! Only JPEG and PNG images are allowed.</HelpBlock>
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
            <FormControl.Feedback />
            <HelpBlock>Minimum of 50 characters</HelpBlock>
          </FormGroup>
          <FormGroup controlId="confirmDetails">
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
