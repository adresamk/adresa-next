import PlaceTestMapClient from "./PlaceTestMapClient";

interface MapTestProps {}
export default async function MapTestPage({}: MapTestProps) {
  return (
    <div>
      <PlaceTestMapClient />
    </div>
  );
}
