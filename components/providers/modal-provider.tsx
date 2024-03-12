"use client";

import { useEffect, useState } from "react";
import { RemoveFavoriteBookModal } from "../modals/remove-favBook-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <RemoveFavoriteBookModal />
    </>
  );
};
