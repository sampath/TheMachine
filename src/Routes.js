import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import ListingItem from "./containers/ListingItem";
import NotFound from "./containers/404";
import Login from "./containers/Login";

export default () =>
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/login" exact component={Login} />
    <Route path="/listingitem" exact component={ListingItem} />
    <Route component={NotFound} />
  </Switch>;

