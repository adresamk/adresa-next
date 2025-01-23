import MapWithCustomPaneClient from "./MapWithCustomPaneClient";
interface MapTestProps {}
export default async function MapTestPage({}: MapTestProps) {
  return (
    <div>
      {/* <MapWithControlsStatic /> */}
      <MapWithCustomPaneClient />
    </div>
  );
}
