import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import { Link } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import SpinningLoader from "./components/SpinningLoader";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storageValue: 0,
      web3: null,
      accounts: null,
      contract: null
    };
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  renderLoading() {
    return (
      <SpinningLoader
        block
        loadingText="Loading Web3, accounts, and contract..."
      />
    );
  }

renderLander() {
    let childProps = {
      accounts: this.state.accounts,
      contract: this.state.contract,
      test: "hello"
    };

    return (
      <div className="App home">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">TradeNow</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <LinkContainer to="/createlisting">
                <NavItem>Sell An Item</NavItem>
              </LinkContainer>
              <LinkContainer to="/marketplace">
                <NavItem>Browse Marketplace</NavItem>
              </LinkContainer>
              <LinkContainer to="/mypurchases">
                <NavItem>My Purchases</NavItem>
              </LinkContainer>
              <LinkContainer to="/mylistings">
                <NavItem>My Listings</NavItem>
              </LinkContainer>
              <LinkContainer to="/help">
                <NavItem>Help & FAQs</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }

  render() {
    return (
      <div className="App container">
        {!this.state.web3
          ? this.renderLoading()
          : this.renderLander()
        }
      </div>
    );
  }


}

export default App;
