import React, { useEffect, useRef, useState } from "react";
import "../../styles/UserMap.scss";
import axios from "axios";

import {
  loadGoogleMapScript,
  initializeGoogleMap,
} from "../../helpers/google.js";
import {
  favouritesCoordinates,
  favouritesMarkers,
} from "../../helpers/selectors.js";

const mapStyles = {
  width: "70%",
  // height: "50vh",
};
const mapStyles2 = {
  width: "100%",
  // height: "50vh",
};
const markers = [];
const infowindows = [];

const UserMap = (props) => {
  const googleMapRef = useRef(null);
  const token = localStorage.getItem("auth-token");
  const [userFavourites, setUserFavourites] = useState([]);

  const getFavouritesData = async () => {
    if (!token) {
      return null;
    } else {
      const res = await axios.get(
        "https://toronto-city-travel-guide.herokuapp.com/getFavourites",
        { headers: { "x-auth-token": token } }
      );
      const favourites = res.data.favourites;
      if (favourites === null || favourites[0] === undefined) {
        return null;
      } else if (favourites[0] !== undefined) {
        setUserFavourites(res.data.favourites);
        const favourites = res.data.favourites;
        return favouritesCoordinates(favourites);
      }
    }
  };

  useEffect(() => {
    loadGoogleMapScript(() => {
      initializeGoogleMap(googleMapRef.current);
    });
    createUserMap();
  }, [token]);

  // Retrieve favourites and add create favourites map
  const createUserMap = async () => {
    const data = await getFavouritesData();
    if (data === null) {
      return null;
    } else {
      const favouritesCoordinates = await getFavouritesData();
      const map = initializeGoogleMap(googleMapRef.current);

      // create list/table of favourites
      const addResults = (place, i) => {
        var favouritesResults = document.getElementById("favouritesResults");
        // creates tr element = table row?
        var tr = document.createElement("tr");
        // alternate row background colour between white and grey
        tr.style.backgroundColor = i % 2 === 0 ? "#F0F0F0" : "#FFFFFF";
        // creates td element = table data?
        var nameTd = document.createElement("td");
        // add onclick to trigger infowindown for associated place
        nameTd.onclick = function () {
          window.google.maps.event.trigger(markers[i], "click");
        };

        // create remove button
        var btn = document.createElement("BUTTON");
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
        var name = document.createTextNode(place[1]);
        // attach name to td element
        nameTd.appendChild(name);
        // attach name to associated row
        tr.appendChild(nameTd);
        // attach button to associated row
        tr.appendChild(btn);
        // add table row to list/table of favourites
        favouritesResults.appendChild(tr);
      };

      // map through favouritesCoordinates array and add marker for each place
      // open an infowindow when the marker is clicked
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
        markers[i].addListener("click", function () {
          infowindows[i].open(map, markers[i]);
        });
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
      {token && props.home === false && userFavourites.length <= 0 && (
        <div id="no-favourites-container">
          <div id="no-favourite-map" ref={googleMapRef} style={mapStyles2} />
        </div>
      )}
      {token && props.home === false && userFavourites.length > 0 && (
        <div id="favourites-container">
          <div id="favouritesListing">
            <table id="resultsTable">
              <tbody id="favouritesResults"></tbody>
            </table>
          </div>
          <div id="favourite-map" ref={googleMapRef} style={mapStyles} />
        </div>
      )}
    </>
  );
};

export default UserMap;
