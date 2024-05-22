"use client";

import { useModal } from "@/hooks/use-modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Badge } from "../ui/badge";
import { subscriptionType } from "@/types/subscription";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export const SubscriptionSuccessModal = () => {
  const { isOpen, onClose, type } = useModal();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const subsType = searchParams.get("subscription");

  const isModalOpen = isOpen && type === "subscriptionSuccess";

  if (!isModalOpen) {
    return null;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-2">
            <Badge className="bg-emerald-500 text-zinc-900 hover:bg-emerald-600">
              Success
            </Badge>
            <h2 className="text-2xl font-bold">
              {subsType === subscriptionType.SUBSCRIBE.toLowerCase()
                ? "Subscribed"
                : "Subscription updated"}{" "}
              successfully
            </h2>
          </DialogTitle>
          <DialogDescription className="text-center py-2 space-y-2 font-medium">
            This website is just a demo, so there is no real subscription.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => {
              onClose();
              router.replace(pathname, undefined);
            }}
            size={"lg"}
            className="w-full uppercase hover:opacity-70 
            bg-blue-500/15 text-blue-500 border-blue-500/70 
            border-2 hover:bg-blue-500/20 transition-none"
          >
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
