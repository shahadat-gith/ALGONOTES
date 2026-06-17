import React from "react";
import { ArrowLeft, BookMarked, Save } from "lucide-react";
import Button from "../../common/Button";
import Badge from "../../common/Badge";

const Header = ({ topic, saving, onNavigateBack, onSaveChanges }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-4 mb-4 font-mono select-none flex-shrink-0">
      <div className="flex items-center gap-4 min-w-0">
        <h1 className="text-lg font-bold text-text-main tracking-wide truncate mt-0.5">
          Topic: {topic}
        </h1>
      </div>

      <Badge variant="success">
       <p className="p-2">Edit note and upload images wherever needed!</p>
      </Badge>

      <Button
        variant="primary"
        size="md"
        loading={saving}
        onClick={onSaveChanges}
      >
        <Save size={14} />
        <span>Save Changes</span>
      </Button>
    </div>
  );
};

export default Header;
