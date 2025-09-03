import { Loader2 } from "lucide-react";

const SuspenseLoading = () => {
  return (
    <div className="w-full flex justify-center ">
      <Loader2 className="w-20 h-20 animate-spin" />
    </div>
  );
};
export default SuspenseLoading;
