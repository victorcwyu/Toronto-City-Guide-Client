import React, { useState, useEffect, useRef } from 'react'

export default function Map({ options, onMount, className, onMountProps }) {
  const ref = useRef();
  const [map, setMap] = useState();

  useEffect(() => {
    const onLoad = () => setMap(new window.google.maps.Map(ref.current, options));
    if (!window.google) {
      const script = document.createElement(`script`);
      script.src =
        `https://maps.googleapis.com/maps/api/js?key=` +
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      document.head.append(script);
      script.addEventListener(`load`, onLoad);
      return () => script.removeEventListener(`load`, onLoad);
    } else onLoad();
  }, [options]);

  if (map && typeof onMount === `function`) onMount(map, onMountProps)

  return (
    <div
      style={{ height: `300px`, width: `400px`, margin: `1em 0`, borderRadius: `0.5em` }}
      {...{ ref, className }}
    />
  )
}

Map.defaultProps = {
  options: {
    center: { lat: 43.6560811, lng: -79.3823601 },
    zoom: 14,
  },
}