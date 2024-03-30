"use client";

import { useEffect, useState } from "react";

import { RemoveFavoriteBookModal } from "../modals/remove-favBook-modal";
import { UpgradePlanModal } from "../modals/upgrade-plan-modal";
import { FinishBookModal } from "../modals/finish-book-modal";

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
      <UpgradePlanModal />
      <FinishBookModal />
    </>
  );
};
