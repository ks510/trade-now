import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import CreateListing from "./containers/CreateListing";
import Marketplace from "./containers/Marketplace";
import MyPurchases from "./containers/MyPurchases";
import MyListings from "./containers/MyListings";
import Help from "./containers/Help";

export default ({ childProps }) => {
  const { accounts, contract } = childProps;

  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route
        path="/createlisting"
        exact
        render={(props) => <CreateListing {...props} accounts={accounts} contract={contract} /> }
      />
      <Route path="/marketplace" exact component={Marketplace} />
      <Route path="/mypurchases" exact component={MyPurchases} />
      <Route path="/mylistings" exact component={MyListings} />
      <Route path="/help" exact component={Help} />
      { /* Finally, catch all unmatched routes */ }
      <Route component={NotFound} />
    </Switch>
  );
}
