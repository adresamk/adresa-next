// src/contexts/SelectedListingContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SelectedListingContextType {
  selectedListingId: number | null;
  setSelectedListingId: (id: number | null) => void;
}

const SelectedListingContext = createContext<
  SelectedListingContextType | undefined
>(undefined);

export const SelectedListingProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedListingId, setSelectedListingId] = useState<number | null>(
    null,
  );

  return (
    <SelectedListingContext.Provider
      value={{ selectedListingId, setSelectedListingId }}
    >
      {children}
    </SelectedListingContext.Provider>
  );
};

export const useSelectedListing = () => {
  const context = useContext(SelectedListingContext);
  if (!context) {
    throw new Error(
      "useSelectedListing must be used within a SelectedListingProvider",
    );
  }
  return context;
};
