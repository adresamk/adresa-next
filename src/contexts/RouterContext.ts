import { createContext } from "react";

interface RouterContextProps {
  updateSecondarySearchParams: () => void;
  clearSecondaryFilters: () => void;
}

const RouterContext = createContext<RouterContextProps>({
  updateSecondarySearchParams: () => {},
  clearSecondaryFilters: () => {},
});

export default RouterContext;
