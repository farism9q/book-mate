"use client";
import { createContext, useState } from "react";

interface NavToggleProviderProps {
  children: React.ReactNode;
}

export const NavToggleContext = createContext({
  open: false,
  onOpenChange: () => {},
});

export const NavToggleProvider = ({ children }: NavToggleProviderProps) => {
  const [isClicked, setIsClicked] = useState(false);

  const open = isClicked;
  const onOpenChange = () => setIsClicked((clicked: boolean) => !clicked);

  return (
    <NavToggleContext.Provider
      value={{
        open,
        onOpenChange,
      }}
    >
      {children}
    </NavToggleContext.Provider>
  );
};
