import React, { useEffect, useRef, useContext } from "react";
import "../../styles/FavouritesMap.scss";
// import axios from "axios";
import UserContext from '../../context/UserContext';

var markers = [];
var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
var hostnameRegexp = new RegExp('^https?://.+?/');

const mapStyles = {
  width: "800px",
  height: "430px",
};

const FavouritesMap = () => {

  const googleMapRef = useRef(null);
  const { userData, setUserData } = useContext(UserContext);

  useEffect(() => {
    initPlaceAPI();
  }, []);

  // Initialize the Google Place autocomplete
  const initPlaceAPI = () => {


    // map through favourites array, extract the latitude and longitude of each place
    const favourites = userData.user.favourites;

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
    favouritesCoordinates.forEach((place) => {
      let marker = new window.google.maps.Marker({ position: place[0], map: map });
      let infowindow = new window.google.maps.InfoWindow({
        content: `<b>${place[1]}</b><br>${place[2]}`
      });
      marker.addListener('click', function () {
        infowindow.open(map, marker);
      });
    });

    // Load the place information into the HTML elements used by the info window.
    function buildIWContent(place) {
      document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
        'src="' + place.icon + '"/>';
      document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
        '">' + place.name + '</a></b>';
      document.getElementById('iw-address').textContent = place.vicinity;
      if (place.formatted_phone_number) {
        document.getElementById('iw-phone-row').style.display = '';
        document.getElementById('iw-phone').textContent =
          place.formatted_phone_number;
      } else {
        document.getElementById('iw-phone-row').style.display = 'none';
      }

      // The regexp isolates the first part of the URL (domain plus subdomain)
      // to give a short URL for displaying in the info window.
      if (place.website) {
        var fullUrl = place.website;
        var website = hostnameRegexp.exec(place.website);
        if (website === null) {
          website = 'http://' + place.website + '/';
          fullUrl = website;
        }
        document.getElementById('iw-website-row').style.display = '';
        document.getElementById('iw-website').textContent = website;
      } else {
        document.getElementById('iw-website-row').style.display = 'none';
      }
    }







  };

  return (
    <>
      <div
        id="favourite-map"
        ref={googleMapRef}
        style={mapStyles}
      />
    </>
  );
};

export default FavouritesMap;