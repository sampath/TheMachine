import React, { Component } from "react";
import ListingTile from "./ListingTile";
import "./Home.css";

const listingList = [
  {
    name: "JBL Flip 3",
    price: "10",
    imagesrc: "./images/jbl_flip_3.jpg",
    imagealt: "jblflip3"
  },
  {
    name: "Canon G7X",
    price: "30",
    imagesrc: "./images/canon_g7x.jpg",
    imagealt: "canong7x"
  },
  {
    name: "Shure SM58",
    price: "20",
    imagesrc: "./images/shure_sm58.jpg",
    imagealt: "shuresm58"
  },
  {
    name: "Anker Battery",
    price: "3",
    imagesrc: "./images/anker_battery.jpg",
    imagealt: "ankerbattery"
  },
  {
    name: "Nintendo 3DS XL",
    price: "20",
    imagesrc: "./images/3dsxl.jpg",
    imagealt: "3dsxl"
  },
  {
    name: "Surfboard",
    price: "5",
    imagesrc: "./images/surfboard.jpg",
    imagealt: "surfboard"
  },
]

export default class Home extends Component {
  listingClick() {
    console.log("listing clicked");
  }

  render() {
    return (
      <div className="Home">
        <div className="lander">
          {
            listingList.map((item, i) => (
              <ListingTile
                key={item.imagealt}
                item={item}
              />
            ))
          }
        </div>
      </div>
    );
  }
}
