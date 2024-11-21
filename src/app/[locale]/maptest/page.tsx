import MapWithControlsStatic from "./MapWithControlsStatic";
import MapWithCustomPane from "./MapWithCustomPane";
interface MapTestProps {}
export default async function MapTestPage({}: MapTestProps) {
  return (
    <div>
      {/* <MapWithControlsStatic /> */}
      <MapWithCustomPane />
    </div>
  );
}
