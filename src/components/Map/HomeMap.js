import { functions, isEqual, omit } from "lodash"
import React, { useEffect, useRef } from "react"
import "../../styles/HomeMap.scss";

// outside function to avoid too many rerenders
const mapStyles = {
  width: "500px",
  height: "500px",
};

function Map({ options, onMount, className, onMountProps }) {

  const ref = useRef();
  const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    // The Google Maps API modifies the options object passed tos
    // the Map constructor in place by adding a mapTypeId with default
    // value 'roadmap'. { ...options } prevents this by creating a copy.
    const onLoad = () =>
      new window.google.maps.Map(ref.current, { ...options });
    if (!window.google) {
      // Create the script tag, set the appropriate attributes
      const script = document.createElement(`script`);
      script.src =
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`;
        // Append the 'script' element to 'head'
      document.head.append(script);
      script.addEventListener(`load`, onLoad);
      return () => script.removeEventListener(`load`, onLoad);
    } else onLoad();
  }, [options]);

  // onMount allows for customization, i.e. adding markers
  // if (map && typeof onMount === `function`) onMount(map, onMountProps);
  // if (map && userData.token) {
  //   map.setOptions({ draggable: false });
  // };

  // function handleClick(e) {
  //   if (!userData.token) {
  //     e.preventDefault();
  //   };
  // }

  return (

    <div
      id="homeMap"
      style={mapStyles}
      {...{ ref, className }}
    />

  //   <Link 
  //     onClick={handleClick}
  //     to="/map"
  //   >
  // <>
  //   {!userData.token &&
  //       <div
  //         id="homeMap"
  //         style={mapStyles}
  //         {...{ ref, className }}
  //       />
  //   }
  //   {userData.token &&
  //     <FavouritesHomeMap />
  //   }
  //   </>
    // </Link>
  );

}

// By default, the Map component will rerender whenever the parent component rerenders.
// shouldNotUpdate/.memo are used in conjunction for optimization.

// If both comparisons return true, it skips the rerender 
// and the user gets to keep the map’s current position and zoom level.
function shouldNotUpdate(props, nextProps) {
  const [funcs, nextFuncs] = [functions(props), functions(nextProps)];
  const noPropChange = isEqual(omit(props, funcs), omit(nextProps, nextFuncs));
  const noFuncChange =
    funcs.length === nextFuncs.length &&
    funcs.every(fn => props[fn].toString() === nextProps[fn].toString());
  return noPropChange && noFuncChange;
}

// .memo shallowly compares props and only rerenders a function component 
// if the comparison returns false
export default React.memo(Map, shouldNotUpdate);

Map.defaultProps = {
  options: {
    center: { lat: 43.6560811, lng: -79.3823601 },
    zoom: 14,
    disableDefaultUI: true,
    draggable: true
  },
}
