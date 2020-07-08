import React, { useEffect, useRef, useState } from "react";
import "../../styles/FavouritesMap.scss";
import axios from "axios";

const mapStyles = {
  width: "70%",
  // height: "50vh",
};
const mapStyles2 = {
  width: "100%",
  // height: "50vh",
};
let markers = [];
let infowindows = [];

const FavouritesMap = () => {

  const googleMapRef = useRef(null);
  const token = localStorage.getItem("auth-token");
  const [userFavourites, setUserFavourites] = useState([]);


  const getFavouritesData = async () => {
    let res = await axios.get("https://toronto-city-travel-guide.herokuapp.com/getFavourites", { headers: {"x-auth-token": token} });
    setUserFavourites(res.data.favourites)
    return res.data.favourites;
  };

  useEffect(() => {
    initPlaceAPI();
  }, []);

  // Initialize the Google Place autocomplete
  const initPlaceAPI =  async () => {

    // map through favourites array, extract the latitude and longitude of each place
    let favourites = await getFavouritesData();

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

    const addResults = (place, i) => {

      // create list/table of favourites
      // return favourite place element 
      var favouritesResults = document.getElementById('favouritesResults');
      // // creates tr element = table row?
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
          axios.post("https://toronto-city-travel-guide.herokuapp.com/removeFavourite", { place }, {
            headers: {
              "x-auth-token": token
            }
          })
            .then((res) => setUserFavourites(res.data))
            .then(() => initPlaceAPI())
        }
        catch (err) {
          console.error(err);
        };
      }

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
    }

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
      addResults(place, i)
    });  
  };

//   return (
//     <div id="favourites-container">
//       {userFavourites.length > 0 &&
//         <div id="favouritesListing">
//           <table id="resultsTable">
//             <tbody id="favouritesResults">
//             </tbody>
//           </table>
//         </div>
//       }
//       <div
//         id="favourite-map"
//         ref={googleMapRef}
//         style={mapStyles}
//       />
//     </div>
//   )
// }

// export default FavouritesMap;






  return (
    <>
      {userFavourites.length <= 0 &&
        <div id="no-favourites-container">
          <div
            id="no-favourite-map"
            ref={googleMapRef}
            style={mapStyles2}
          />
        </div>
      }
      {userFavourites.length > 0 &&
        <div id="favourites-container">
          <div id="favouritesListing">
            <table id="resultsTable">
              <tbody id="favouritesResults">
              </tbody>
            </table>
          </div>
          <div
            id="favourite-map"
            ref={googleMapRef}
            style={mapStyles}
          />
        </div>
      }
    </>
  )
}

export default FavouritesMap;