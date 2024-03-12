import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary">
        <Loader2 className="w-32 h-32" />
      </div>
    </div>
  );
};

export default Loading;
