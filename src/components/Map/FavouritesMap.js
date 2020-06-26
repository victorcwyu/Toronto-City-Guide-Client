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

    // Initialize the Google map
    const map = new window.google.maps.Map(googleMapRef.current, {
      center: { lat: 43.6560811, lng: -79.3823601 },
      zoom: 14,
      disableDefaultUI: true
    });

    // map through favourites array, extract the latitude and longitude of each place
    let favourites = await getFavourites();

    const favouritesCoordinates = favourites.map((favourite) => {
      return [
        { lat: favourite.geometry.location.lat, lng: favourite.geometry.location.lng },
        favourite.name, 
        favourite.vicinity
      ];
    })
  
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
      var favouritesResults = document.getElementById('favouritesResults');
      var tr = document.createElement('tr');
      tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
      tr.onclick = function () {
        window.google.maps.event.trigger(markers[i], 'click');
      };
      var nameTd = document.createElement('td');
      var name = document.createTextNode(favouritesCoordinates[i][1]);
      nameTd.appendChild(name);
      tr.appendChild(nameTd);
      favouritesResults.appendChild(tr);
    });
  };

  if (userData.user.favourites = []) {
    return (
      <>
        <h1>No favourites added yet!</h1>
        <div
          id="favourite-map"
          ref={googleMapRef}
          style={mapStyles}
        />
      </>
    )
  }
  return (
    <>
      <div
        id="favourite-map"
        ref={googleMapRef}
        style={mapStyles}
      />
      <div id="listing">
        <table id="resultsTable">
          <tbody id="favouritesResults">
            <h1>Favourite Places</h1>
          </tbody>
        </table>
      </div>  
    </>
  );
};

export default FavouritesMap;