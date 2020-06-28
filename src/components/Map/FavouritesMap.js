import React, { useEffect, useRef, useContext } from "react";
import "../../styles/FavouritesMap.scss";
import axios from "axios";
import UserContext from '../../context/UserContext';

const mapStyles = {
  width: "800px",
  height: "430px",
};
let markers = [];
let infowindows = [];

const FavouritesMap = () => {

  const googleMapRef = useRef(null);
  const { userData, setUserData } = useContext(UserContext);
  const token = userData.token

  const getFavourites = async () => {
    let res = await axios.get("http://localhost:5000/getFavourites", { headers: {"x-auth-token": token} });
    return res.data.favourites;
  };

  useEffect(() => {
    initPlaceAPI();
  }, []);

  // Initialize the Google Place autocomplete
  const initPlaceAPI =  async () => {

    // map through favourites array, extract the latitude and longitude of each place
    let favourites = await getFavourites();

    const favouritesCoordinates = favourites.map((favourite) => {
      return [
        { lat: favourite.geometry.location.lat, lng: favourite.geometry.location.lng },
        favourite.name, 
        favourite.vicinity
      ];
    })
  
    // Initialize the Google map
    const map = new window.google.maps.Map(googleMapRef.current, {
      center: { lat: 43.6560811, lng: -79.3823601 },
      zoom: 14,
      disableDefaultUI: true
    });

    // map through favouritesCoordinates array and add marker for each place
    // open an infowindow when the marker is clicked
    favouritesCoordinates.forEach((place, i) => {
      markers[i] = new window.google.maps.Marker({ position: place[0], map: map });
      infowindows[i] = new window.google.maps.InfoWindow({
        content: `<b>${place[1]}</b>
          <br>
          ${place[2]}
          <br>
        `
      });
      markers[i].addListener('click', function () {
        infowindows[i].open(map, markers[i]);
      });
      // create list/table of favourites
      // return favourite place element 
      var favouritesResults = document.getElementById('favouritesResults');
      // creates tr element = table row?
      var tr = document.createElement('tr');
      // alternate row background colour between white and grey
      tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
      // creates td element = table data?
      var nameTd = document.createElement('td');
      // add onclick to trigger infowindown for associated place
      nameTd.onclick = function () {
        window.google.maps.event.trigger(markers[i], 'click');
      };

      // create remove button
      var btn = document.createElement("BUTTON"); 
      btn.innerHTML = "Remove from favourites";
      btn.onclick = function () {
        try {
          axios.post("http://localhost:5000/removeFavourite", { place }, {
            headers: {
              "x-auth-token": token
            }
          })
            .then(res => {
              console.log(res);
            });
        }
        catch (err) {
          console.error(err);
        };
      }

      // create text node which is the favourite place name
      var name = document.createTextNode(favouritesCoordinates[i][1]);
      // attach name to td element
      nameTd.appendChild(name);
      // attach name to associated row
      tr.appendChild(nameTd);
      // attach button to associated row
      tr.appendChild(btn);
      // add table row to list/table of favourites
      favouritesResults.appendChild(tr);
    });
  };
  
  return (
    <>
      <div
        id="favourite-map"
        ref={googleMapRef}
        style={mapStyles}
      />
      {(userData.user.favourites[0] != undefined) &&
      <div id="listing">
        <table id="resultsTable">
          <tbody id="favouritesResults">
            <h1>Favourite Places</h1>
          </tbody>
        </table>
      </div>  
      }
    </>
  );
}

export default FavouritesMap;