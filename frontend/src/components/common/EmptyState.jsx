import { FileText } from "lucide-react";
import Button from "./Button";

const EmptyState = ({
  title = "No data found",
  description = "There is nothing to show here yet.",
  actionText = "",
  onAction,
}) => {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-dashed border-border-default bg-bg-surface p-8 text-center shadow-card transition-all duration-200">
      <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary-soft p-4 text-primary group-hover:scale-105 transition-transform duration-200">
        <FileText size={28} className="stroke-[1.75]" />
      </div>

      <h3 className="text-base font-semibold text-text-main tracking-tight">
        {title}
      </h3>

      <p className="mt-1.5 max-w-sm text-sm text-text-light leading-relaxed">
        {description}
      </p>

      {actionText && (
        <Button className="mt-6 shadow-xs" onClick={onAction} size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;