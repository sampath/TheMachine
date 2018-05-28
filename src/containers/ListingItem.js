import React, { Component } from "react";
import "./ListingItem.css";

let itemName = "";

export default class ListingItem extends Component {
  constructor(props) {
    super(props);

    this.props = props;
    itemName = this.props.location.state;
  }

  render() {
    return (
      <h1>hullo save me: {itemName}</h1>
    );
  }
}