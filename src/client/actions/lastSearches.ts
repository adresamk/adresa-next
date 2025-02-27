import { readFromLocalStorage, writeToLocalStorage } from "@/lib/utils";

type LatLng = {
  lat: number;
  lng: number;
};

type BaseLastSearchCriteria = {
  category: string;
  transactionType: string;
  sortBy: string;
  sortOrder: string;
  destination: string;
};

type AreaBasedSearchCriteria = BaseLastSearchCriteria & {
  areaIDs: string[];
  polygon?: never;
};

type PolygonBasedSearchCriteria = BaseLastSearchCriteria & {
  polygon: LatLng[];
  areaIDs?: never;
};

type LastSearchCriteria = AreaBasedSearchCriteria | PolygonBasedSearchCriteria;

type LastSearch = {
  addedToLastSearches: number;
  savedSearchTitle: string;
  searchCriteria: LastSearchCriteria;
  searchHash: string;
};

const MAX_SEARCHES = 7;
function generateSearchHash(searchCriteria: LastSearchCriteria): string {
  return "";
}

function generateSavedSearchTitle(searchCriteria: LastSearchCriteria): string {
  return "";
}

export function registerLastSearch(destination: string) {
  const previousSearches: LastSearch[] =
    readFromLocalStorage("lastSearches") || [];
  const addedToLastSearches = Date.now();

  // Determine other values from destination
  const searchCriteria: LastSearchCriteria = {
    destination,
    category: "", // These values should be determined based on your logic
    transactionType: "",
    sortBy: "",
    sortOrder: "",
    areaIDs: [], // or polygon: [] depending on your logic
  };

  const savedSearchTitle = generateSavedSearchTitle(searchCriteria); // or however you want to generate the title
  const searchHash = generateSearchHash(searchCriteria); // You'll need to implement this

  // Find if the search hash already exists
  const existingIndex = previousSearches.findIndex(
    (search: LastSearch) => search.searchHash === searchHash,
  );

  if (existingIndex !== -1) {
    // If exists, remove it from current position
    const existingSearch = previousSearches.splice(existingIndex, 1)[0];
    // Update its time and put it at the front
    existingSearch.addedToLastSearches = addedToLastSearches;
    previousSearches.unshift(existingSearch);
  } else {
    // Add new search to front, ensure MAX_SEARCHES limit
    previousSearches.unshift({
      addedToLastSearches,
      savedSearchTitle,
      searchCriteria,
      searchHash,
    });
    if (previousSearches.length > MAX_SEARCHES) {
      // or .pop()
      previousSearches.splice(MAX_SEARCHES, 1);
    }
  }

  writeToLocalStorage("lastSearches", previousSearches);
}
