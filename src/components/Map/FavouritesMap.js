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


    // map through favourites array, get the latitude and longitude of each place
    const favourites = userData.user.favourites;
    console.log("lat: ", favourites[0].geometry.location.lat, "lng: ", favourites[0].geometry.location.lng)

    // Initialize the Google map
    const map = new window.google.maps.Map(googleMapRef.current, {
      center: { lat: 43.6560811, lng: -79.3823601 },
      zoom: 14,
      disableDefaultUI: true
    });

    // Initialize central marker
    new window.google.maps.Marker({
      position: map.center,
      map: map
    });

    // Initialize infoWindow
    const infoWindow = new window.google.maps.InfoWindow({
      content: document.getElementById('info-content')
    });

    // initialize Google Places
    // const places = new window.google.maps.places.PlacesService(map);
    window.places = new window.google.maps.places.PlacesService(map);

    // Search for a place type near the selected location, within the viewport of the map.
    function search() {
      const searchPlaceType = localStorage.getItem('searchPlaceType');

      var search = {
        bounds: map.getBounds(),
        types: [`${searchPlaceType}`],
      };
      // Clear results and markers when a new search is made
      // Ensures the results table is blank if no places are found
      clearResults();
      clearMarkers();
      window.places.nearbySearch(search, function (results, status) {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          // Create a marker for each place type found, and
          // assign a letter of the alphabetic to each marker icon.
          for (var i = 0; i < results.length; i++) {
            var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
            var markerIcon = MARKER_PATH + markerLetter + '.png';
            // Use marker animation to drop the icons incrementally on the map.
            markers[i] = new window.google.maps.Marker({
              position: results[i].geometry.location,
              animation: window.google.maps.Animation.DROP,
              icon: markerIcon
            });
            // If the user clicks a hotel marker, show the details of that hotel
            // in an info window.
            markers[i].placeResult = results[i];
            window.google.maps.event.addListener(markers[i], 'click', showInfoWindow);
            setTimeout(dropMarker(i), i * 100);
            addResult(results[i], i);
          }
        }
      });
    }
    
    function clearMarkers() {
      for (var i = 0; i < markers.length; i++) {
        if (markers[i]) {
          markers[i].setMap(null);
        }
      }
      markers = [];
    }
    function dropMarker(i) {
      return function () {
        markers[i].setMap(map);
      };
    }
    function addResult(result, i) {
      var results = document.getElementById('results');
      var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
      var markerIcon = MARKER_PATH + markerLetter + '.png';
      var tr = document.createElement('tr');
      tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
      tr.onclick = function () {
        window.google.maps.event.trigger(markers[i], 'click');
      };
      var iconTd = document.createElement('td');
      var nameTd = document.createElement('td');
      var icon = document.createElement('img');
      icon.src = markerIcon;
      icon.setAttribute('class', 'placeIcon');
      icon.setAttribute('className', 'placeIcon');
      var name = document.createTextNode(result.name);
      iconTd.appendChild(icon);
      nameTd.appendChild(name);
      tr.appendChild(iconTd);
      tr.appendChild(nameTd);
      results.appendChild(tr);
    }
    function clearResults() {
      var results = document.getElementById('results');
      while (results.childNodes[0]) {
        results.removeChild(results.childNodes[0]);
      }
    }
    // Get the place details for a place type. Show the information in an info window,
    // anchored on the marker for the place that the user selected.
    function showInfoWindow() {
      var marker = this;
      window.uniqueId = marker.placeResult.place_id;
      window.places.getDetails({ placeId: marker.placeResult.place_id },
        function (place, status) {
          if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
            return;
          }
          infoWindow.open(map, marker);
          buildIWContent(place);
        });
    }
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
      // Assign a five-star rating to the place, using a black star ('&#10029;')
      // to indicate the rating the place has earned, and a white star ('&#10025;')
      // for the rating points not achieved.
      if (place.rating) {
        var ratingHtml = '';
        for (var i = 0; i < 5; i++) {
          if (place.rating < (i + 0.5)) {
            ratingHtml += '&#10025;';
          } else {
            ratingHtml += '&#10029;';
          }
          document.getElementById('iw-rating-row').style.display = '';
          document.getElementById('iw-rating').innerHTML = ratingHtml;
        }
      } else {
        document.getElementById('iw-rating-row').style.display = 'none';
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