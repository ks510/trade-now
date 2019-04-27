import React, { Component } from "react";
import {
  InputGroup,
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel,
  Checkbox,
  Image,
  Label
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
      isLoading: false,
      titleCharLimit: 70,
      wei: 0,
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
      this.state.listingTitle.length <= this.state.titleCharLimit &&
      this.state.listingPrice > 0 &&
      this.isValidPrice(this.state.listingPrice) &&
      this.state.listingDescription.length > 0 &&
      this.state.preview != null &&
      this.state.confirmDetails === true
    );
  }

  // validate input string for price is either integer or decimal
  isValidPrice = (input) => {
    return !isNaN(parseFloat(input)) && isFinite(input);
  }

  convertToWei = (amount) => {
    const { web3 } = this.props;
    return web3.utils.toWei(amount, 'ether');
  }

  submitListing = async (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });

    const { accounts, contract } = this.props;

    // prepare metadata for listing to store in contract
    // upload image and description to IPFS and get hashes
    await this.uploadFileToIPFS();

    // convert decimal Ether price from user input to Wei
    const weiPrice = await this.convertToWei(this.state.listingPrice);

    try {
      // send transaction to contract to store new listing
      await contract.methods.createListing(
        weiPrice,
        this.state.listingTitle,
        this.state.listingDescription,
        this.state.imageIPFS
      ).send({ from: accounts[0] });

      // go to listing success page
      this.props.history.push("/createlisting/success");
    } catch (error) {
      console.error(error);
      this.setState({ isLoading: false });
    }


  }

  uploadFileToIPFS = async (event) => {
    // post file to IPFS, get the IPFS hash and store it in contract
    try {
      let results = await ipfs.add(this.state.imageBuffer);
      let imageIPFS = results[0].hash;

      this.setState({ imageIPFS });

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
          <FormGroup controlId="listingTitle" bsSize="large"
            validationState={this.state.listingTitle.length < this.state.titleCharLimit ? null : "error"}
          >
            <ControlLabel>Title of your listing</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.listingTitle}
              onChange={this.handleChange}
              placeholder="Please enter a title for your listing"
            />
            <FormControl.Feedback />
            <HelpBlock>{this.state.listingTitle.length} / {this.state.titleCharLimit} characters left</HelpBlock>
          </FormGroup>

          <FormGroup controlId="listingImage" bsSize="large">
            <ControlLabel>Upload a photo of your item</ControlLabel>
            <FormControl
              type="file"
              accept=".png,.jpg"
              onChange={this.captureFile}
            />
            <FormControl.Feedback />
            <HelpBlock>Use a clear photograph of your item! Only JPG and PNG images are allowed.</HelpBlock>
            <Image src={this.state.preview} width={300} height={300} responsive />
          </FormGroup>

          <div className="listingPrice">
            <FormGroup controlId="listingPrice" bsSize="large"
              validationState={this.isValidPrice(this.state.listingPrice) ? null : "error"}>
              <ControlLabel>Selling Price</ControlLabel>
              <InputGroup>
                <FormControl
                  value={this.state.price}
                  onChange={this.handleChange}
                  placeholder="Ether"
                />
                <InputGroup.Addon>ETH</InputGroup.Addon>
              </InputGroup>
              {!this.isValidPrice(this.state.listingPrice)
                ? <Label>Only integers and decimal numbers allowed!</Label>
                : null
              }
            </FormGroup>
          </div>

          <FormGroup controlId="listingDescription">
            <ControlLabel>Description</ControlLabel>
            <FormControl
              componentClass="textarea"
              value={this.state.listingDescription}
              onChange={this.handleChange}
              placeholder="Include more details about the item such as specification, measurements, condition etc."
              rows={10}
            />
            <FormControl.Feedback />
            <HelpBlock>Use plaintext only, HTML/CSS not supported.</HelpBlock>
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
