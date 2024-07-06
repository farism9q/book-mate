"use client";

import { useEffect, useState } from "react";

import { RemoveFavoriteBookModal } from "../../features/favorite-books/components/remove-favBook-modal";
import { UpgradePlanModal } from "../modals/upgrade-plan-modal";
import { ReviewBookModal } from "../../features/review/components/review-book-modal";
import { EditUserProfileSheet } from "../../features/account/components/edit-user-profile-sheet";
import { SendEmailModal } from "../modals/send-email-modal";
import { SubscriptionSuccessModal } from "../modals/subscription-modal";

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
      <ReviewBookModal />
      <EditUserProfileSheet />
      <SendEmailModal />
      <SubscriptionSuccessModal />
    </>
  );
};
