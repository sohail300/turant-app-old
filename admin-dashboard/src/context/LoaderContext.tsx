"use client";

import { createContext, useContext, useState } from "react";

interface LoaderContextProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const LoaderContext = createContext<LoaderContextProps>({
  isLoading: false,
  setIsLoading: () => {},
});

export const useLoaderContext = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};
