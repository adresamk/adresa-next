// import L from "leaflet";
// import { useEffect } from "react";
// import { useMap } from "react-leaflet";

// // const mcg = L.markerClusterGroup();

// const MarkerCluster = ({ markers }: { markers: any[] }) => {
//   const map = useMap();

//   useEffect(() => {
//     mcg.clearLayers();
//     markers.forEach(({ position, text }) =>
//       L.marker(new L.LatLng(position.lat, position.lng), {
//         icon: customMarker
//       })
//         .addTo(mcg)
//         .bindPopup(text)
//     );

//     // optionally center the map around the markers
//     // map.fitBounds(mcg.getBounds());
//     // // add the marker cluster group to the map
//     map.addLayer(mcg);
//   }, [markers, map]);

//   return null;
// };
