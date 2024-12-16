import L from "leaflet";
import exactPin from "@/assets/icons/exact-pin.svg";
export const exactPinIcon = new L.Icon({
  iconUrl: exactPin,
  iconRetinaUrl: exactPin,
  popupAnchor: [-0, -0],
  iconSize: [32, 45],
  className: "leaflet-div-icon exact marker-pin",
});
