import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "../../common/Button";
import Badge from "../../common/Badge";

const PreparationHeader = ({ isProcessing }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between border-b border-border-default pb-5">
      <Button
        size="sm"
        variant="outline"
        onClick={() => navigate("/preparation")}
        className="h-9 text-xs font-semibold px-4 border-border-default hover:bg-bg-soft text-text-main flex items-center gap-1.5 cursor-pointer"
      >
        <ArrowLeft size={14} className="stroke-[2]" />
        <span>Back</span>
      </Button>

      <div className="flex items-center gap-3.5">
        <Badge
          variant={isProcessing ? "warning" : "success"}
          className="text-[11px] px-2.5 py-0.5"
        >
          {isProcessing ? "Processing" : "Ready"}
        </Badge>
      </div>
    </div>
  );
};

export default PreparationHeader;