import { Loader2 } from "lucide-react";

export const ChatLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary">
        <Loader2 className="w-16 h-16" />
      </div>
    </div>
  );
};
