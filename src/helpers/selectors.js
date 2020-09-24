const favouritesCoordinates = function (favouritesArr) {
  const coordinates = favouritesArr.map((favourite) => {
    return [
      { lat: favourite.geometry.location.lat, lng: favourite.geometry.location.lng },
      favourite.name,
      favourite.vicinity
    ];
  })
  return coordinates
}

const favouritesMarkers = function (coordinates, map) {
  const markers = [];
  const infowindows = [];
  // map through favouritesCoordinates array and add marker for each place
  coordinates.forEach((place, i) => {
    markers[i] = new window.google.maps.Marker({ position: place[0], map: map });
    infowindows[i] = new window.google.maps.InfoWindow({
      content: `<b>${place[1]}</b>
            <br>
            ${place[2]}
            <br>
          `
    });
    // open an infowindow when the marker is clicked
    markers[i].addListener('click', function () {
      infowindows[i].open(map, markers[i]);
    });
  })
}

export { favouritesCoordinates, favouritesMarkers }