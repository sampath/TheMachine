import React, { Component } from "react";
import "./ListingTile.css";

export default class ListingTile extends Component {
  constructor(props) {
    super(props);

    this.props = props;
    console.log(this.props.item.imagesrc);
  }

  render() {
    return (
      <div className="listing-tile">
        <div className="listing-pic">
          <img src={this.props.item.imagesrc} alt={this.props.item.imagealt} />
        </div>
        <h1 className="listing-title">{this.props.item.name}</h1>
        <h4 className="listing-price">${this.props.item.price}/day</h4>
      </div>
    )
  }
}