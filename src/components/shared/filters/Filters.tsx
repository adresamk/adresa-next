import ModeFilter from "./ModeFilter";
import PriceFilter from "./PriceFilter";
import PropertyTypeFilter from "./PropertyTypeFilter";
import SubTypeFilter from "./SubtypeFilter";
import SurfaceFilter from "./SurfaceFilter";

export default function Filters() {
  return (
    <aside className="flex gap-3 items-center px-6 min-h-[70px] top-[80px] sticky z-10 shadow-md bg-white">
      <ModeFilter variant="search" />
      <PropertyTypeFilter variant="search" />
      <SubTypeFilter variant="search" />
      <PriceFilter variant="search" />
      <SurfaceFilter variant="search" />
    </aside>
  );
}
