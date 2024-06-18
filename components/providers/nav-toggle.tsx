"use client";

import { createContext, useState } from "react";

interface NavToggleProviderProps {
  children: React.ReactNode;
}

export const NavToggleContext = createContext({
  open: false,
  onOpenChange: () => {},
  onClose: () => {},
  isSidebarExpanded: true,
  toggleSidebar: () => {},
});

export const NavToggleProvider = ({ children }: NavToggleProviderProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const open = isClicked;
  const onOpenChange = () => setIsClicked((clicked: boolean) => !clicked);
  const onClose = () => setIsClicked(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <NavToggleContext.Provider
      value={{
        open,
        onOpenChange,
        onClose,
        isSidebarExpanded,
        toggleSidebar,
      }}
    >
      {children}
    </NavToggleContext.Provider>
  );
};
