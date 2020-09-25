import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import "../../styles/Autocomplete.scss";
import { initializeGoogleMap } from "../../helpers/helpers.js";
import PlaceTypeSelector from "./PlaceTypeSelector";
import axios from "axios";

const countryRestrict = { country: "ca" };
let markers = [];
const MARKER_PATH =
  "https://developers.google.com/maps/documentation/javascript/images/marker_green";
const hostnameRegexp = new RegExp("^https?://.+?/");
const noDisplay = {
  display: "none",
};
const mapStyles = {
  width: "70%",
};

const Autocomplete = () => {
  const history = useHistory();
  const placeInputRef = useRef(null);
  const googleMapRef = useRef(null);

  useEffect(() => {
    if (!window.google) {
      history.push("/");
    } else {
      initPlaceAPI();
    }
  }, []);

  // Initialize the Google Place autocomplete
  const initPlaceAPI = () => {
    // Initialize the Google map
    const map = initializeGoogleMap(googleMapRef.current);

    // Initialize infoWindow
    const infoWindow = window.google
      ? new window.google.maps.InfoWindow({
          content: document.getElementById("info-content"),
        })
      : null;

    // Restrict the search to Canada, in the lat/lng bounds of Toronto.
    const bounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(43.619132, -79.480562),
      new window.google.maps.LatLng(43.95843, -78.320516)
    );
    const autocomplete = new window.google.maps.places.Autocomplete(
      placeInputRef.current,
      {
        bounds: bounds,
        componentRestrictions: countryRestrict,
      }
    );

    // initialize Google Places
    window.places = new window.google.maps.places.PlacesService(map);

    // When autocomplete selection made, pan to and zoom in on selected location
    new window.google.maps.event.addListener(
      autocomplete,
      "place_changed",
      function () {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          map.panTo(place.geometry.location);
          map.setZoom(15);
          search();
        } else {
          document.getElementById("autocomplete").placeholder =
            "Enter a location";
        }
      }
    );

    // Search for a place type near the selected location, within the viewport of the map.
    function search() {
      const searchPlaceType = localStorage.getItem("searchPlaceType");

      const search = {
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
          for (let i = 0; i < results.length; i++) {
            const markerLetter = String.fromCharCode(
              "A".charCodeAt(0) + (i % 26)
            );
            const markerIcon = MARKER_PATH + markerLetter + ".png";
            // Use marker animation to drop the icons incrementally on the map.
            markers[i] = new window.google.maps.Marker({
              position: results[i].geometry.location,
              animation: window.google.maps.Animation.DROP,
              icon: markerIcon,
            });
            // If the user clicks a hotel marker, show the details of that hotel
            // in an info window.
            markers[i].placeResult = results[i];
            window.google.maps.event.addListener(
              markers[i],
              "click",
              showInfoWindow
            );
            setTimeout(dropMarker(i), i * 100);
            addResult(results[i], i);
          }
        }
      });
    }
    function clearMarkers() {
      for (let i = 0; i < markers.length; i++) {
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
      const results = document.getElementById("results");
      const markerLetter = String.fromCharCode("A".charCodeAt(0) + (i % 26));
      const markerIcon = MARKER_PATH + markerLetter + ".png";
      const tr = document.createElement("tr");
      tr.style.backgroundColor = i % 2 === 0 ? "#F0F0F0" : "#FFFFFF";
      tr.onclick = function () {
        window.google.maps.event.trigger(markers[i], "click");
      };
      const iconTd = document.createElement("td");
      const nameTd = document.createElement("td");
      const icon = document.createElement("img");
      icon.src = markerIcon;
      icon.setAttribute("class", "placeIcon");
      icon.setAttribute("className", "placeIcon");
      const name = document.createTextNode(result.name);
      iconTd.appendChild(icon);
      nameTd.appendChild(name);
      tr.appendChild(iconTd);
      tr.appendChild(nameTd);
      results.appendChild(tr);
    }
    function clearResults() {
      const results = document.getElementById("results");
      while (results.childNodes[0]) {
        results.removeChild(results.childNodes[0]);
      }
    }
    // Get the place details for a place type. Show the information in an info window,
    // anchored on the marker for the place that the user selected.
    function showInfoWindow() {
      const marker = this;
      window.uniqueId = marker.placeResult.place_id;
      window.places.getDetails(
        { placeId: marker.placeResult.place_id },
        function (place, status) {
          if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
            return;
          }
          infoWindow.open(map, marker);
          buildIWContent(place);
        }
      );
    }
    // Load the place information into the HTML elements used by the info window.
    function buildIWContent(place) {
      document.getElementById("iw-icon").innerHTML =
        '<img class="hotelIcon" ' + 'src="' + place.icon + '"/>';
      document.getElementById("iw-url").innerHTML =
        '<b><a href="' + place.url + '">' + place.name + "</a></b>";
      document.getElementById("iw-address").textContent = place.vicinity;
      if (place.formatted_phone_number) {
        document.getElementById("iw-phone-row").style.display = "";
        document.getElementById("iw-phone").textContent =
          place.formatted_phone_number;
      } else {
        document.getElementById("iw-phone-row").style.display = "none";
      }
      // Assign a five-star rating to the place, using a black star ('&#10029;')
      // to indicate the rating the place has earned, and a white star ('&#10025;')
      // for the rating points not achieved.
      if (place.rating) {
        let ratingHtml = "";
        for (let i = 0; i < 5; i++) {
          if (place.rating < i + 0.5) {
            ratingHtml += "&#10025;";
          } else {
            ratingHtml += "&#10029;";
          }
          document.getElementById("iw-rating-row").style.display = "";
          document.getElementById("iw-rating").innerHTML = ratingHtml;
        }
      } else {
        document.getElementById("iw-rating-row").style.display = "none";
      }
      // The regexp isolates the first part of the URL (domain plus subdomain)
      // to give a short URL for displaying in the info window.
      if (place.website) {
        const website = hostnameRegexp.exec(place.website);
        if (website === null) {
          website = "http://" + place.website + "/";
        }
        document.getElementById("iw-website-row").style.display = "";
        document.getElementById("iw-website").textContent = website;
      } else {
        document.getElementById("iw-website-row").style.display = "none";
      }
    }
  };

  // get favourites to check if place has already been added
  // used Axios instead of userData (comes back as object instead of array?)
  const token = localStorage.getItem("auth-token");
  const getFavourites = async () => {
    const res = await axios.get(
      "https://toronto-city-travel-guide.herokuapp.com/getFavourites",
      { headers: { "x-auth-token": token } }
    );
    return res.data.favourites;
  };

  const alreadyInFavourites = () =>
    alert("This place is already in your favourites!");

  const handleAddFavourite = async (e) => {
    e.preventDefault();
    window.places.getDetails({ placeId: window.uniqueId }, async function (
      place,
      status
    ) {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        return;
      }
      const favourites = await getFavourites();
      const doesFavouriteExist = await favourites.filter(
        (favourite) => favourite.place_id !== place.place_id
      );
      if (doesFavouriteExist.length === favourites.length) {
        try {
          axios
            .post(
              "https://toronto-city-travel-guide.herokuapp.com/addFavourite",
              { place },
              {
                headers: {
                  "x-auth-token": token,
                },
              }
            )
            .then((res) => {
              console.log(res);
            });
        } catch (err) {
          console.error(err);
        }
      } else {
        alreadyInFavourites();
      }
    });
  };

  return (
    <>
      <div id="map-page-autocomplete">
        <div className="hotel-search">
          <PlaceTypeSelector />
          <div id="locationField">
            <input
              id="autocomplete"
              placeholder="Enter a location"
              type="text"
              ref={placeInputRef}
            />
            <div id="listing">
              <table id="resultsTable">
                <tbody id="results"></tbody>
              </table>
            </div>
          </div>
        </div>
        <div id="map" ref={googleMapRef} style={mapStyles} />
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
                <tr>
                  <td>
                    <button onClick={handleAddFavourite}>
                      Add to favourites
                    </button>
                  </td>
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
