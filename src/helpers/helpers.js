const initializeGoogleMap = (ref) => {
  return new window.google.maps.Map(ref, {
    center: { lat: 43.6560811, lng: -79.3823601 },
    zoom: 14,
    disableDefaultUI: true,
  });
};

const favouritesCoordinates = function (favouritesArr) {
  const coordinates = favouritesArr.map((favourite) => {
    return [
      {
        lat: favourite.geometry.location.lat,
        lng: favourite.geometry.location.lng,
      },
      favourite.name,
      favourite.vicinity,
    ];
  });
  return coordinates;
};

export { initializeGoogleMap, favouritesCoordinates };
