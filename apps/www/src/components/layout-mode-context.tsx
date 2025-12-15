"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

type LayoutModeContextValue = {
  isNarrow: boolean;
  toggle: () => void;
};

const LayoutModeContext = createContext<LayoutModeContextValue | undefined>(undefined);

export function LayoutModeProvider({ children }: { children: React.ReactNode }) {
  const [isNarrow, setIsNarrow] = useState(false);
  const toggle = useCallback(() => setIsNarrow((prev) => !prev), []);

  return (
    <LayoutModeContext.Provider value={{ isNarrow, toggle }}>
      {children}
    </LayoutModeContext.Provider>
  );
}

export function useLayoutMode() {
  const ctx = useContext(LayoutModeContext);
  if (!ctx) {
    throw new Error("useLayoutMode must be used within LayoutModeProvider");
  }
  return ctx;
}

