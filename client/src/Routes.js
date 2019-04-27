import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import CreateListing from "./containers/CreateListing";
import Marketplace from "./containers/Marketplace";
import MyPurchases from "./containers/MyPurchases";
import PurchaseSuccess from "./containers/PurchaseSuccess";
import MyListings from "./containers/MyListings";
import Help from "./containers/Help";
import CreateListingSuccess from "./containers/CreateListingSuccess";
import Listing from "./containers/Listing";
import DeliverySuccess from "./containers/DeliverySuccess";
import ListingDisabled from "./containers/ListingDisabled";

export default ({ childProps }) => {
  const { accounts, contract, web3 } = childProps;

  return (
    <Switch>
      <Route
        path="/"
        exact
        render={(props) => <Home {...props} accounts={accounts} contract={contract} web3={web3} /> }
      />
      <Route
        path="/createlisting"
        exact
        render={(props) => <CreateListing {...props} accounts={accounts} contract={contract} web3={web3} /> }
      />
      <Route path="/createlisting/success" exact component={CreateListingSuccess} />
      <Route
        path="/marketplace"
        exact
        render={(props) => <Marketplace {...props} accounts={accounts} contract={contract} web3={web3} /> }
      />
      <Route
        path="/mypurchases"
        exact
        render={(props) => <MyPurchases {...props} accounts={accounts} contract={contract} web3={web3} /> }
      />
      <Route path="/purchasesuccess" exact component={PurchaseSuccess} />
      <Route
        path="/mylistings"
        exact
        render={(props) => <MyListings {...props} accounts={accounts} contract={contract} web3={web3} /> }
      />
      <Route
        path="/listing/:id"
        exact
        render={(props) => <Listing {...props} accounts={accounts} contract={contract} web3={web3} /> }
      />
      <Route path="/deliveryconfirmed" exact component={DeliverySuccess} />
      <Route path="/listingdisabled" exact component={ListingDisabled} />
      <Route path="/help" exact component={Help} />
      { /* Finally, catch all unmatched routes */ }
      <Route component={NotFound} />
    </Switch>
  );
}
