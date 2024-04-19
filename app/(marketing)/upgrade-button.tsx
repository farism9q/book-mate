import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Loader } from "lucide-react";

export const UpgradeButton = () => {
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
    <button
      onClick={onUpgrade}
      className={cn(
        "group relative rounded-lg p-px text-sm/6 text-zinc-400 duration-300",
        !isLoading && "hover:text-zinc-100 hover:shadow-glow",
        isLoading && "cursor-not-allowed"
      )}
    >
      <span className="absolute inset-0 overflow-hidden rounded-lg">
        <span className="absolute inset-0 rounded-lg bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(255,191,0,0.6)_0%,rgba(255,191,0,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <div className="relative flex items-center justify-center gap-x-2 z-10 rounded-lg bg-zinc-950 px-4 py-1.5 ring-1 ring-white/10">
        {isLoading && <Loader className="w-4 h-4 animate-spin" />}
        Upgrade
      </div>
      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-amber-400/0 via-amber-400/90 to-cyan-400/0 transition-opacity duration-500 group-hover:opacity-40" />
    </button>
  );
};
