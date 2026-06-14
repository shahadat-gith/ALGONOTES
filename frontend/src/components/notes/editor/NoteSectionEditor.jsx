import React from "react";
import {
  Plus,
  Trash2,
  FileText,
  ListChecks,
  Code,
  Table,
  Footprints,
  Layers,
} from "lucide-react";

import HeadingBlockEditor from "./blocks/HeadingBlockEditor";
import ParagraphBlockEditor from "./blocks/ParagraphBlockEditor";
import BulletBlockEditor from "./blocks/BulletBlockEditor";
import StepBlockEditor from "./blocks/StepBlockEditor";
import CodeBlockEditor from "./blocks/CodeBlockEditor";
import TableBlockEditor from "./blocks/TableBlockEditor";

const ACTION_LABELS = {
  heading: { label: "Section Title", icon: Layers },
  paragraph: { label: "Text", icon: FileText },
  bullet: { label: "Key Points", icon: ListChecks },
  step: { label: "Algorithm Step", icon: Footprints },
  code: { label: "Code Snippet", icon: Code },
  table: { label: "Dry Run Table", icon: Table },
};

const SECTION_ACTIONS = {
  summary: ["heading", "paragraph", "bullet"],
  intuition: ["paragraph", "bullet"],
  bruteForce: ["paragraph", "bullet", "code"],
  optimalApproach: ["paragraph", "bullet", "code"],
  algorithm: ["step", "paragraph"],
  dryRun: ["table", "paragraph"],
  complexity: ["bullet", "paragraph"],
  edgeCases: ["bullet", "paragraph"],
  mistakesToAvoid: ["bullet", "paragraph"],
};

const NoteSectionEditor = ({
  sectionKey,
  title,
  blocks = [],
  onChange,
  language,
}) => {
  const allowedActions = SECTION_ACTIONS[sectionKey] || [
    "paragraph",
    "bullet",
    "code",
  ];

  const updateBlock = (index, patch) => {
    const updated = blocks.map((block, i) =>
      i === index ? { ...block, ...patch } : block
    );

    onChange(updated);
  };

  const addBlock = (type) => {
    const newBlock = {
      type,
      order: blocks.length + 1,
    };

    if (["heading", "paragraph", "step"].includes(type)) {
      newBlock.text = "";
    }

    if (type === "bullet") {
      newBlock.items = [""];
    }

    if (type === "code") {
      newBlock.code = "";
      newBlock.language = language || "C++";
    }

    if (type === "table") {
      newBlock.table = [
        {
          step: "1",
          state: "",
          action: "",
          result: "",
        },
      ];
    }

    onChange([...blocks, newBlock]);
  };

  const deleteBlock = (index) => {
    const updated = blocks
      .filter((_, i) => i !== index)
      .map((block, idx) => ({
        ...block,
        order: idx + 1,
      }));

    onChange(updated);
  };

  const renderBlock = (block, index) => {
    const commonProps = {
      block,
      index,
      sectionKey,
      onUpdate: (patch) => updateBlock(index, patch),
    };

    switch (block.type) {
      case "heading":
        return <HeadingBlockEditor {...commonProps} />;

      case "paragraph":
        return <ParagraphBlockEditor {...commonProps} />;

      case "bullet":
        return <BulletBlockEditor {...commonProps} />;

      case "step":
        return <StepBlockEditor {...commonProps} />;

      case "code":
        return <CodeBlockEditor {...commonProps} language={language} />;

      case "table":
        return <TableBlockEditor {...commonProps} />;

      default:
        return <ParagraphBlockEditor {...commonProps} />;
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 border-b border-[var(--border-default)] pb-3">
        <Layers size={18} className="text-[var(--primary)]" />

        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">
          {title}
        </h3>
      </div>

      <div className="space-y-5">
        {blocks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border-default)] bg-[var(--bg-base)] p-8 text-center">
            <p className="text-xs italic text-[var(--text-light)]">
              Nothing added here yet.
            </p>
          </div>
        ) : (
          blocks.map((block, index) => (
            <div
              key={`${sectionKey}-${index}`}
              className="group relative rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] p-4 transition hover:border-[var(--border-strong)]"
            >
              <div className="absolute right-3 top-3 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => deleteBlock(index)}
                  className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-1.5 text-[var(--text-light)] shadow-sm hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {renderBlock(block, index)}
            </div>
          ))
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-[var(--border-default)] pt-4">
        {allowedActions.map((type) => {
          const item = ACTION_LABELS[type];
          const Icon = item.icon;

          return (
            <button
              key={type}
              type="button"
              onClick={() => addBlock(type)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2 text-xs font-semibold text-[var(--text-muted)] shadow-sm transition hover:bg-[var(--bg-soft)] hover:text-[var(--text-main)]"
            >
              <Plus size={12} />
              <Icon size={13} />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NoteSectionEditor;