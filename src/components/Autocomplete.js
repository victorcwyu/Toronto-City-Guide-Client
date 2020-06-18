import React, { useEffect, useRef, useState } from "react";
import { FormControl, FormLabel, FormControlLabel, RadioGroup, Radio } from "@material-ui/core";
import "../styles/Autocomplete.scss";

const countryRestrict = { 'country': 'ca' };
var markers = [];
var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
var hostnameRegexp = new RegExp('^https?://.+?/');
const noDisplay = {
  display: "none",
}
const mapStyles = {
  width: "440px",
  // width: "100%",
  height: "430px",
};

const Autocomplete = () => {
  const placeInputRef = useRef(null);
  const googleMapRef = useRef(null);

  useEffect(() => {
    initPlaceAPI();
  }, []);

  // initialize the google place autocomplete
  const initPlaceAPI = () => {
    // initialize the google map
    const map = new window.google.maps.Map(googleMapRef.current, {
      center: { lat: 43.6560811, lng: -79.3823601 },
      zoom: 14,
      disableDefaultUI: true
    });

    const infoWindow = new window.google.maps.InfoWindow({
      content: document.getElementById('info-content')
    });

    const bounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(43.619132, -79.480562),
      new window.google.maps.LatLng(43.95843, -78.320516)
    );
    // Restrict the search to Canada, in the lat/lng bounds of Toronto.
    let autocomplete = new window.google.maps.places.Autocomplete(
      placeInputRef.current,
      {
        bounds: bounds,
        componentRestrictions: countryRestrict
      });

    const places = new window.google.maps.places.PlacesService(map);

    new window.google.maps.event.addListener(autocomplete, "place_changed", function () {
      let place = autocomplete.getPlace();
      if (place.geometry) {
        map.panTo(place.geometry.location);
        map.setZoom(15);
        search();
      } else {
        document.getElementById('autocomplete').placeholder = 'Enter a location';
      }
    });

    // Search for hotels near the selected location, within the viewport of the map.
    function search() {
      var search = {
        bounds: map.getBounds(),
        types: ['lodging'],
      };
      places.nearbySearch(search, function (results, status) {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          clearResults();
          clearMarkers();
          // Create a marker for each hotel found, and
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
    // Get the place details for a hotel. Show the information in an info window,
    // anchored on the marker for the hotel that the user selected.
    function showInfoWindow() {
      var marker = this;
      places.getDetails({ placeId: marker.placeResult.place_id },
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
      // Assign a five-star rating to the hotel, using a black star ('&#10029;')
      // to indicate the rating the hotel has earned, and a white star ('&#10025;')
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
      <div id="map-page-autocomplete">
        <div className="hotel-search">


          <div id="findhotels">
            <h2>Find</h2>
            <FormControl component="fieldset">
              {/* <FormLabel component="legend">Find</FormLabel> */}
              {/* <RadioGroup aria-label="place-type" name="place-type" value={value} onChange={handleChange}> */}
              <RadioGroup aria-label="place-type" name="place-type">
              {/* <RadioGroup aria-label="place-type" name="place-type"> */}
                <FormControlLabel value="lodging" control={<Radio />} label="accommodation" />
                <FormControlLabel value="convenience_store" control={<Radio />} label="convenience store" />
                <FormControlLabel value="tourist_attraction" control={<Radio />} label="tourist attraction" />
                {/* <FormControlLabel value="disabled" disabled control={<Radio />} label="(Disabled option)" /> */}
              </RadioGroup>
            </FormControl>
          </div>

{/* use local storage to save the selection
clear when changed.
call this in search method above:
if accommodation {

} else if supermarket etc... */}


          <div id="locationField">
            <input id="autocomplete" placeholder="Enter a location" type="text" ref={placeInputRef} />
          </div>
        </div>
        <div
          id="map"
          ref={googleMapRef}
          style={mapStyles}
        />
        <div id="listing">
          <table id="resultsTable">
            <tbody id="results"></tbody>
          </table>
        </div>
        <div style={noDisplay}>
          <div id="info-content">
            <table>
              <tbody>
                <tr id="iw-url-row" className="iw_table_row">
                  <td id="iw-icon" className="iw_table_icon"></td>
                  <td id="iw-url"></td>
                </tr>
                <tr id="iw-address-row" className="iw_table_row">
                  <td className="iw_attribute_name">Address:</td>
                  <td id="iw-address"></td>
                </tr>
                <tr id="iw-phone-row" className="iw_table_row">
                  <td className="iw_attribute_name">Telephone:</td>
                  <td id="iw-phone"></td>
                </tr>
                <tr id="iw-rating-row" className="iw_table_row">
                  <td className="iw_attribute_name">Rating:</td>
                  <td id="iw-rating"></td>
                </tr>
                <tr id="iw-website-row" className="iw_table_row">
                  <td className="iw_attribute_name">Website:</td>
                  <td id="iw-website"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </>
  );
};

export default Autocomplete;