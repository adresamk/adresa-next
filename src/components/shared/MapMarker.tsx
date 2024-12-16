import { LocationPrecision } from "@prisma/client";
import "./MapMarker.css"; // Import CSS for styling
import { cn } from "@/lib/utils";

interface MapMarkerProps {
  locationPrecision: LocationPrecision; // Define the possible precision values
  onHover?: () => void; // Optional hover handler
  zoomLevel: number;
  isOpen: boolean;
}

const MapMarker: React.FC<MapMarkerProps> = ({
  locationPrecision,
  onHover,
  zoomLevel,
  isOpen,
}) => {
  // Function to determine the marker class based on locationPrecision
  const getMarkerClass = () => {
    switch (locationPrecision) {
      case "exact":
        return "marker-high";
      case "approximate":
        return "approximate";
      case "wide":
        return "wide";
      default:
        return "marker-normal";
    }
  };
  const lp = locationPrecision;

  return (
    <div
      className={cn(
        `map-marker`,
        lp === "exact" && "marker-high",
        lp === "approximate" && "approximate",
        lp === "wide" && "wide",
      )}
      onMouseEnter={onHover}
      onMouseLeave={onHover}
      style={{ position: "relative", cursor: "pointer" }}
    >
      <span className="marker-label">Location</span>
      <div className="marker-icon" />
      {/* Additional content can go here */}
    </div>
  );
};

export default MapMarker;
