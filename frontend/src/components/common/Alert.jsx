import React from "react";
import { AlertTriangle, RefreshCw, CheckCircle2, AlertCircle, Info } from "lucide-react";

const Alert = ({ 
  title, 
  message, 
  variant = "danger", 
  actionLabel, 
  onAction 
}) => {
  if (!message && !title) return null;

  // Configuration map for different status profiles based on your theme variables
  const variantConfig = {
    danger: {
      container: "border-danger/10 bg-danger-soft/40 text-danger",
      icon: <AlertTriangle size={15} className="shrink-0 mt-0.5 stroke-[2]" />,
      actionHover: "hover:text-primary"
    },
    warning: {
      container: "border-warning/10 bg-warning-soft/40 text-warning",
      icon: <AlertCircle size={15} className="shrink-0 mt-0.5 stroke-[2]" />,
      actionHover: "hover:text-warning"
    },
    success: {
      container: "border-success/10 bg-success-soft/40 text-success",
      icon: <CheckCircle2 size={15} className="shrink-0 mt-0.5 stroke-[2]" />,
      actionHover: "hover:text-success"
    },
    info: {
      container: "border-border-strong bg-bg-soft/60 text-text-main",
      icon: <Info size={15} className="shrink-0 mt-0.5 stroke-[2] text-primary" />,
      actionHover: "hover:text-primary"
    }
  };

  const currentVariant = variantConfig[variant] || variantConfig.danger;

  return (
    <div className={`flex items-start gap-3.5 rounded-sm border p-4 text-xs animate-fade-in shadow-xs ${currentVariant.container}`}>
      {currentVariant.icon}
      
      <div className="space-y-1.5 flex-1 min-w-0">
        {title && (
          <p className="font-semibold tracking-wide">
            {title}
          </p>
        )}
        
        {message && (
          <p className="text-text-muted leading-relaxed font-normal">
            {message}
          </p>
        )}

        {/* Action Button renders conditionally if action handler exists */}
        {onAction && actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors pt-1 cursor-pointer font-mono ${currentVariant.actionHover}`}
          >
            <RefreshCw size={11} className="stroke-[2]" />
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;