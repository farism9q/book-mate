"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";

import { Book, Check, MessageSquare, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

const tools = [
  {
    label: "unlimited books",
    icon: Book,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "unlimited chats",
    icon: MessageSquare,

    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
  },
];

export const UpgradePlanModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "upgradePlan";

  const [isLoading, setIsLoading] = useState(false);

  const onUpgrade = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/stripe");

      window.location.href = response.data.url;
    } catch (err) {
      toast.error("Failed to upgrade plan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold py-1">
              Upgrade to
              <Badge variant={"premium"} className="uppercase text-sm py-1">
                pro
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center py-2 space-y-2 text-zinc-900 font-medium">
            {tools.map(tool => (
              <Card
                key={tool.label}
                className="flex justify-between items-center p-3 border-black/5"
              >
                <div className="flex gap-x-4 items-center">
                  <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                    <tool.icon className={cn("w-6 h-6", tool.color)} />
                  </div>
                  <div className="font-semibold text-sm uppercase">
                    {tool.label}
                  </div>
                </div>
                <Check className="text-emerald-500 w-5 h-5" />
              </Card>
            ))}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={onUpgrade}
            disabled={isLoading}
            size={"lg"}
            variant={"premium"}
            className="w-full uppercase hover:opacity-70"
          >
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
