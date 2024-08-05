import SearchFilter from "./SearchFilter";

export default function SearchHeroDisplay() {
  return (
    <div className="grid  place-content-center min-h-[420px] bg-search-filter bg-cover bg-no-repeat bg-bottom w-full py-5">
      <div className="">
        <h1 className="text-[50px] drop-shadow-md text-white font-bold mb-10 text-center">
          Find your next address
        </h1>
        <SearchFilter />
      </div>
    </div>
  );
}
