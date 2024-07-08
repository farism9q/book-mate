"use client";

import { useEffect, useState } from "react";

import { EditUserProfileSheet } from "../../features/account/components/edit-user-profile-sheet";

export const SheetProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <EditUserProfileSheet />
    </>
  );
};
