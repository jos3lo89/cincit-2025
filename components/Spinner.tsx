// components/ui/spinner.tsx
import { Loader2 } from "lucide-react";

export const Spinner = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
};
