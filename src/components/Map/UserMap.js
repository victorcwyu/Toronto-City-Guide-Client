import React, { useEffect, useRef, useState } from "react";
import "../../styles/UserMap.scss";
import axios from "axios";

import {
  initializeGoogleMap,
  favouritesCoordinates,
} from "../../helpers/helpers.js";

const mapStyles = {
  width: "70%",
};
const mapStyles2 = {
  width: "100%",
};
const markers = [];
const infowindows = [];

const UserMap = (props) => {
  const googleMapRef = useRef(null);
  const token = localStorage.getItem("auth-token");
  const [userFavourites, setUserFavourites] = useState([]);

  useEffect(() => {
    createUserMap();
  }, [token]);

  const getFavouritesData = async () => {
    if (!token) {
      return [];
    } else if (token) {
      const res = await axios.get(
        "https://toronto-city-travel-guide.herokuapp.com/getFavourites",
        { headers: { "x-auth-token": token } }
      );
      const favourites = res.data.favourites;
      if (favourites === null || favourites[0] === undefined) {
        return [];
      } else if (favourites[0] !== undefined) {
        setUserFavourites(res.data.favourites);
        const favourites = res.data.favourites;
        return favouritesCoordinates(favourites);
      }
    }
  };

  const createUserMap = async () => {
    const favouritesCoordinates = await getFavouritesData();
    if (favouritesCoordinates === []) {
      initializeGoogleMap(googleMapRef.current);
    } else if (favouritesCoordinates !== []) {
      const map = initializeGoogleMap(googleMapRef.current);

      // create list/table of favourites
      const addResults = (place, i) => {
        const favouritesTable = document.getElementById("favouritesTable");
        // create table row element
        const tr = document.createElement("tr");
        // alternate row background colour between white and grey
        tr.style.backgroundColor = i % 2 === 0 ? "#F0F0F0" : "#FFFFFF";
        // create table data element
        const nameTd = document.createElement("td");
        // add onclick to trigger infowindow for associated place
        nameTd.onclick = function () {
          window.google.maps.event.trigger(markers[i], "click");
        };
        // create remove from favourites button
        const btn = document.createElement("BUTTON");
        btn.innerHTML = "Remove from favourites";
        btn.onclick = function () {
          try {
            axios
              .post(
                "https://toronto-city-travel-guide.herokuapp.com/removeFavourite",
                { place },
                {
                  headers: {
                    "x-auth-token": token,
                  },
                }
              )
              .then((res) => setUserFavourites(res.data))
              .then(() => createUserMap());
          } catch (err) {
            console.error(err);
          }
        };

        // create text node which is the favourite place name
        const name = document.createTextNode(place[1]);
        // attach name to td element
        nameTd.appendChild(name);
        // attach name to associated row
        tr.appendChild(nameTd);
        // attach button to associated row
        tr.appendChild(btn);
        // add table row to list/table of favourites
        favouritesTable.appendChild(tr);
      };

      // map through favouritesCoordinates array and add marker for each place
      favouritesCoordinates.forEach((place, i) => {
        markers[i] = new window.google.maps.Marker({
          position: place[0],
          map: map,
        });
        infowindows[i] = new window.google.maps.InfoWindow({
          content: `<b>${place[1]}</b>
          <br>
          ${place[2]}
          <br>
        `,
        });
        // open an infowindow when the marker is clicked
        markers[i].addListener("click", function () {
          infowindows[i].open(map, markers[i]);
        });
        // only build favourites table for the non-home map
        if (props.home === false) {
          addResults(place, i);
        }
      });
    }
  };

  return (
    <>
      {(!token || (token && props.home === true)) && (
        <>
          <div id="homeMap" ref={googleMapRef} />
        </>
      )}
      {token && props.home === false && userFavourites.length === 0 && (
        <div id="no-favourites-container">
          <div id="no-favourite-map" ref={googleMapRef} style={mapStyles2} />
        </div>
      )}
      {token && props.home === false && userFavourites.length !== 0 && (
        <div id="favourites-container">
          <div id="favouritesListing">
            <table id="favouritesTable" cellSpacing="0"></table>
          </div>
          <div id="favourite-map" ref={googleMapRef} style={mapStyles} />
        </div>
      )}
    </>
  );
};

export default UserMap;
