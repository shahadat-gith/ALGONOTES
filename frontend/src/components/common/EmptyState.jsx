import { FileText } from "lucide-react";
import Button from "./Button";

const EmptyState = ({
  title = "No data found",
  description = "There is nothing to show here yet.",
  actionText = "",
  onAction,
}) => {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-default)] bg-white p-8 text-center">
      <div className="mb-4 rounded-full bg-[var(--primary-soft)] p-4 text-[var(--primary)]">
        <FileText size={32} />
      </div>

      <h3 className="text-lg font-bold text-[var(--text-main)]">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-[var(--text-muted)]">
        {description}
      </p>

      {actionText && (
        <Button className="mt-5" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;