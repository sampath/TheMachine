import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./ListingTile.css";

let imagealt = "";

export default class ListingTile extends Component {
  constructor(props) {
    super(props);

    this.props = props;
    imagealt = this.props.item.imagealt;
  }

  render() {
    return (
      <Link
        to={{ pathname: '/listingitem', state: imagealt }}
        style={{ textDecoration: 'none', color: '#3b3b3b' }}
        params={ this.props.item.imagealt }
      >
        <div className="listing-tile">
          <div className="listing-pic">
            <img src={this.props.item.imagesrc} alt={this.props.item.imagealt} />
          </div>
          <h1 className="listing-title">{this.props.item.name}</h1>
          <h4 className="listing-price">${this.props.item.price}/day</h4>
        </div>
      </Link>
    )
  }
}