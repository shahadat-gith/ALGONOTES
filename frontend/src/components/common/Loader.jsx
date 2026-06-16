import { Loader2 } from "lucide-react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-2.5 text-text-light">
      <Loader2 size={28} className="animate-spin text-primary stroke-[1.75]" />
      {text && (
        <p className="text-sm font-medium tracking-wide text-text-muted animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;