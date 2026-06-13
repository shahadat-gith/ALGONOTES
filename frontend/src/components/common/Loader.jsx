import { Loader2 } from "lucide-react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-[var(--text-muted)]">
      <Loader2 size={32} className="animate-spin text-[var(--primary)]" />
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
};

export default Loader;