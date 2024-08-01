import SearchFilter from "./SearchFilter";

export default function SearchHeroDisplay() {
  return (
    <div className="grid  place-content-center h-[400px] bg-search-filter bg-cover bg-no-repeat bg-bottom w-full">
      <div className="">
        <h1 className="text-[50px] drop-shadow-md text-white font-bold mb-10 text-center">
          Find your next address
        </h1>
        <SearchFilter />
      </div>
    </div>
  );
}
