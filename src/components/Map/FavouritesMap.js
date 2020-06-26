import React, { useEffect, useRef, useContext } from "react";
import "../../styles/FavouritesMap.scss";
import axios from "axios";
import UserContext from '../../context/UserContext';

// var hostnameRegexp = new RegExp('^https?://.+?/');

const mapStyles = {
  width: "800px",
  height: "430px",
};
let markers = []

const FavouritesMap = () => {

  const googleMapRef = useRef(null);
  const { userData, setUserData } = useContext(UserContext);
  
  // const token = userData.token
  // const getFavourites = async () => {
  //   let res = await axios.get("http://localhost:5000/getFavourites", { headers: {"x-auth-token": token} });
  //   let favouritesData= res.data;
  //   console.log("this", favouritesData)
  // };

  useEffect(() => {
    // getFavourites();
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
    favouritesCoordinates.forEach((place, i) => {
      markers[i] = new window.google.maps.Marker({ position: place[0], map: map });
      let infowindow = new window.google.maps.InfoWindow({
        content: `<b>${place[1]}</b><br>${place[2]}`
      });
      markers[i].addListener('click', function () {
        infowindow.open(map, markers[i]);
      });

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


      // addResult(favouritesCoordinates);
      // function addResult(favouritesData, i) {

      //   var favouritesResults = document.getElementById('favouritesResults');
      //   var tr = document.createElement('tr');
      //   tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
      //   tr.onclick = function () {
      //     window.google.maps.event.trigger(window.marker[i], 'click');
      //   };
      //   var nameTd = document.createElement('td');
      //   var name = document.createTextNode(favouritesCoordinates[1]);
      //   nameTd.appendChild(name);
      //   tr.appendChild(nameTd);
      //   favouritesResults.appendChild(tr);
      // }


    });

    // for (let i = 0; i < favouritesCoordinates.length; i++) {
    //   addResult(favouritesCoordinates[i], i);
    // }

    // function addResult(favouritesCoordinates, i) {
    //   var favouritesResults = document.getElementById('favouritesResults');
    //   var tr = document.createElement('tr');
    //   tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
    //   tr.onclick = function () {
    //     window.google.maps.event.trigger(window.markers[i], 'click');
    //   };
    //   var nameTd = document.createElement('td');
    //   var name = document.createTextNode(favouritesCoordinates[1]);
    //   nameTd.appendChild(name);
    //   tr.appendChild(nameTd);
    //   favouritesResults.appendChild(tr);
    // }




    // // Load the place information into the HTML elements used by the info window.
    // function buildIWContent(place) {
    //   document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
    //     'src="' + place.icon + '"/>';
    //   document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
    //     '">' + place.name + '</a></b>';
    //   document.getElementById('iw-address').textContent = place.vicinity;
    //   if (place.formatted_phone_number) {
    //     document.getElementById('iw-phone-row').style.display = '';
    //     document.getElementById('iw-phone').textContent =
    //       place.formatted_phone_number;
    //   } else {
    //     document.getElementById('iw-phone-row').style.display = 'none';
    //   }

    //   // The regexp isolates the first part of the URL (domain plus subdomain)
    //   // to give a short URL for displaying in the info window.
    //   if (place.website) {
    //     var fullUrl = place.website;
    //     var website = hostnameRegexp.exec(place.website);
    //     if (website === null) {
    //       website = 'http://' + place.website + '/';
    //       fullUrl = website;
    //     }
    //     document.getElementById('iw-website-row').style.display = '';
    //     document.getElementById('iw-website').textContent = website;
    //   } else {
    //     document.getElementById('iw-website-row').style.display = 'none';
    //   }
    // }
  };

  return (
    <>
      <div
        id="favourite-map"
        ref={googleMapRef}
        style={mapStyles}
      />
      <div id="listing">
        <table id="resultsTable">
          <tbody id="favouritesResults"></tbody>
        </table>
      </div>
    </>
  );
};

export default FavouritesMap;