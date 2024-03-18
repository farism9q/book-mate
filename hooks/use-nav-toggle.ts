import { NavToggleContext } from "@/components/providers/nav-toggle";
import { useContext } from "react";

export const useNavToggle = () => {
  const context = useContext(NavToggleContext);
  if (!context) {
    throw new Error("useNavToggle must be used within a NavToggleProvider");
  }
  return context;
};
