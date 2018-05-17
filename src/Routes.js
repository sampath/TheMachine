import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/404";

export default () =>
  <Switch>
    <Route path="/" exact component={Home} />
    <Route component={NotFound} />
  </Switch>;

