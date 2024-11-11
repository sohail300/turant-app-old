import { createContext, useContext } from "react";

export const FontContext = createContext<boolean>(false);

export const useFontLoaded = () => useContext(FontContext);
