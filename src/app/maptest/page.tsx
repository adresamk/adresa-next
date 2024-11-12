import MapWithControls from "@/components/MapWithControls";

interface MapTestProps {}
export default async function MapTestPage({}: MapTestProps) {
  return (
    <div>
      <MapWithControls />
    </div>
  );
}
