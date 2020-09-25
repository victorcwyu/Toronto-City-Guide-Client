const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const loadGoogleMapScript = (callback) => {
  if (
    typeof window.google === "object" &&
    typeof window.google.maps === "object"
  ) {
    callback();
  } else {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`;
    window.document.body.appendChild(googleMapScript);
    googleMapScript.addEventListener("load", callback);
  }
};

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

export { loadGoogleMapScript, initializeGoogleMap, favouritesCoordinates };
