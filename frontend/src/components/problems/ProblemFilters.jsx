import React from "react";
import Select from "../common/Select";
import Button from "../common/Button";
import { FilterX } from "lucide-react";
import { PLATFORM_OPTIONS, DIFFICULTY_OPTIONS, LANGUAGE_OPTIONS } from "../../constants/problems";

const ProblemFilters = ({
  platform,
  setPlatform,
  difficulty,
  setDifficulty,
  language,
  setLanguage,
  onReset
}) => {
  // Determine if any active filters are applied to show/hide the clear button dynamically
  const hasActiveFilters = platform !== "" || difficulty !== "" || language !== "";

  return (
    <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-[var(--shadow-card)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end transition-all duration-200">
      
      <Select
        label="Platform"
        options={PLATFORM_OPTIONS}
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
      />

      <Select
        label="Difficulty"
        options={DIFFICULTY_OPTIONS}
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      />

      <Select
        label="Language"
        options={LANGUAGE_OPTIONS}
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      />

      {/* Reset Action Button Container */}
      <div className="w-full flex items-center justify-end h-full pt-1 sm:pt-0">
        <Button
          variant="secondary"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="w-full justify-center h-[46px] bg-[var(--bg-soft)] text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-40 transition-all border-none"
        >
          <FilterX size={14} className="shrink-0" />
          Clear Filters
        </Button>
      </div>

    </div>
  );
};

export default ProblemFilters;