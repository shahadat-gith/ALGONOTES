
import React from "react";
import Input from "../common/Input";
import Select from "../common/Select";
import { X } from "lucide-react";
import { PLATFORM_OPTIONS, DIFFICULTY_OPTIONS, LANGUAGE_OPTIONS, TOPIC_OPTIONS } from "../../constants/problems";

const ProblemForm = ({ formData, setFormData, selectedTopics, setSelectedTopics, errors, setErrors, loading }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleTopicSelect = (e) => {
    const topic = e.target.value;
    if (!topic) return;

    if (selectedTopics.includes(topic)) {
      e.target.value = "";
      return;
    }

    if (selectedTopics.length >= 5) {
      e.target.value = "";
      return;
    }

    setSelectedTopics((prev) => [...prev, topic]);
    e.target.value = "";
  };

  const handleRemoveTopic = (topicToRemove) => {
    setSelectedTopics((prev) => prev.filter((t) => t !== topicToRemove));
  };

  return (
    <div className="space-y-5">
      <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
        Problem Configuration
      </h2>

      <Input
        label="Problem Title *"
        name="title"
        placeholder="e.g., Contains Duplicate II"
        value={formData.title}
        onChange={handleInputChange}
        error={errors.title}
        disabled={loading}
      />

      <Input
        label="Problem URL Link (Optional)"
        name="problemLink"
        placeholder="https://leetcode.com/problems/..."
        value={formData.problemLink}
        onChange={handleInputChange}
        disabled={loading}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Platform"
          options={PLATFORM_OPTIONS}
          value={formData.platform}
          onChange={(e) => setFormData((p) => ({ ...p, platform: e.target.value }))}
          disabled={loading}
        />
        <Select
          label="Difficulty"
          options={DIFFICULTY_OPTIONS}
          value={formData.difficulty}
          onChange={(e) => setFormData((p) => ({ ...p, difficulty: e.target.value }))}
          disabled={loading}
        />
      </div>

      <Select
        label="Programming Language"
        options={LANGUAGE_OPTIONS}
        value={formData.language}
        onChange={(e) => setFormData((p) => ({ ...p, language: e.target.value }))}
        disabled={loading}
      />

      <div className="space-y-2">
        <Select
          label="Add Topic Tags (Max 5)"
          options={TOPIC_OPTIONS}
          onChange={handleTopicSelect}
          disabled={loading}
        />
        
        {selectedTopics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {selectedTopics.map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-[var(--primary-soft)] text-[var(--primary)] rounded-md border border-[var(--primary)]/10"
              >
                {topic}
                <button
                  type="button"
                  onClick={() => handleRemoveTopic(topic)}
                  className="hover:opacity-80 transition-opacity"
                >
                  <X size={12} className="stroke-[2.5]" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemForm;