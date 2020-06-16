import React, { useState, useEffect, useRef } from "react"
import "../styles/SearchAndMap.scss";

// outside function to avoid too many rerenders
// const mapStyles = {
// width: "400px",
// height: "300px",
// };

// This example uses the autocomplete feature of the Google Places API.
// It allows the user to find all hotels near a user inputted location, within
// Toronto. It then displays markers for all the hotels returned,
// with on-click details for each hotel.

// var map, places, infoWindow;
var places, infoWindow;
var markers = [];
var autocomplete;
var countryRestrict = { 'country': 'ca' };
var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
var hostnameRegexp = new RegExp('^https?://.+?/');

// function SearchAndMap() {
//   map = new google.maps.Map(document.getElementById('map'), {
//     zoom: 13,
//     center: { lat: 43.6560811, lng: -79.3823601 },
//     mapTypeControl: false,
//     panControl: false,
//     zoomControl: false,
//     streetViewControl: false
//   });

function SearchAndMap({ options, onMount, className, onMountProps }) {
  const ref = useRef();
  const [map, setMap] = useState();

  useEffect(() => {
    // The Google Maps API modifies the options object passed to
    // the Map constructor in place by adding a mapTypeId with default
    // value 'roadmap'. { ...options } prevents this by creating a copy.
    const onLoad = () =>
      setMap(new window.google.maps.Map(ref.current, { ...options }));
    if (!window.google) {
      // Create the script tag, set the appropriate attributes
      const script = document.createElement(`script`);
      script.src =
        `https://maps.googleapis.com/maps/api/js?key=` +
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY + `& libraries=places`;
      // Append the 'script' element to 'head'
      document.head.append(script);
      script.addEventListener(`load`, onLoad);
      return () => script.removeEventListener(`load`, onLoad);
    } else onLoad();
  }, [options]);

  infoWindow = new google.maps.InfoWindow({
    content: document.getElementById('info-content')
  });

  // Create the autocomplete object and associate it with the UI input control.
  // Restrict the search to Canada, in the lat/lng bounds of Toronto.

  // Set the bounds within the viewport of Toronto.
  var bounds = new google.maps.LatLngBounds(new google.maps.LatLng(43.619132, -79.480562), new google.maps.LatLng(43.95843, -78.320516));

  autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */(
      document.getElementById('autocomplete')), {
    bounds: bounds,
    componentRestrictions: countryRestrict
  });
  places = new google.maps.places.PlacesService(map);

  autocomplete.addListener('place_changed', onPlaceChanged);

  // When the user selects a location, get the place details for the location and
  // zoom the map in on the location.
  function onPlaceChanged() {
    var place = autocomplete.getPlace();
    if (place.geometry) {
      map.panTo(place.geometry.location);
      map.setZoom(15);
      search();
    } else {
      document.getElementById('autocomplete').placeholder = 'Enter a location';
    }
  }

  // Search for hotels near the selected location, within the viewport of the map.
  function search() {
    var search = {
      bounds: map.getBounds(),
      types: ['lodging'],
    };

    places.nearbySearch(search, function (results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        clearResults();
        clearMarkers();
        // Create a marker for each hotel found, and
        // assign a letter of the alphabetic to each marker icon.
        for (var i = 0; i < results.length; i++) {
          var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
          var markerIcon = MARKER_PATH + markerLetter + '.png';
          // Use marker animation to drop the icons incrementally on the map.
          markers[i] = new google.maps.Marker({
            position: results[i].geometry.location,
            animation: google.maps.Animation.DROP,
            icon: markerIcon
          });
          // If the user clicks a hotel marker, show the details of that hotel
          // in an info window.
          markers[i].placeResult = results[i];
          google.maps.event.addListener(markers[i], 'click', showInfoWindow);
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
      google.maps.event.trigger(markers[i], 'click');
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
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
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

  // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap"
  //     async defer></script>

  return (
    <div>
      <div class="hotel-search">
        <div id="findhotels">
          Find accommodation near:
        </div>
        <div id="locationField">
          <input id="autocomplete" placeholder="Enter a location" type="text" />
        </div>
      </div>
      <div id="map"></div>
      <div id="listing">
        <table id="resultsTable">
          <tbody id="results"></tbody>
        </table>
      </div>
      <div style="display: none">
        <div id="info-content">
          <table>
            <tr id="iw-url-row" class="iw_table_row">
              <td id="iw-icon" class="iw_table_icon"></td>
              <td id="iw-url"></td>
            </tr>
            <tr id="iw-address-row" class="iw_table_row">
              <td class="iw_attribute_name">Address:</td>
              <td id="iw-address"></td>
            </tr>
            <tr id="iw-phone-row" class="iw_table_row">
              <td class="iw_attribute_name">Telephone:</td>
              <td id="iw-phone"></td>
            </tr>
            <tr id="iw-rating-row" class="iw_table_row">
              <td class="iw_attribute_name">Rating:</td>
              <td id="iw-rating"></td>
            </tr>
            <tr id="iw-website-row" class="iw_table_row">
              <td class="iw_attribute_name">Website:</td>
              <td id="iw-website"></td>
            </tr>
          </table>
        </div>
      </div>
    </div >
  );
}







export default React.memo(SearchAndMap);

SearchAndMap.defaultProps = {
  options: {
    center: { lat: 43.6560811, lng: -79.3823601 },
    // zoom: 14,
    zoom: 8,
    disableDefaultUI: true,
    zoomControl: true
  },
};