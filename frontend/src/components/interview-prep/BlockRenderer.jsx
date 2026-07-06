import React, { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import mermaid from "mermaid";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// Initialize mermaid once
mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    primaryColor: "#1e3a5f",
    primaryTextColor: "#e2e8f0",
    lineColor: "#475569",
    secondaryColor: "#1a202c",
    tertiaryColor: "#0f172a",
  },
});

const PRISM_LANGUAGE_MAP = {
  "C++": "cpp",
  Java: "java",
  Python: "python",
  JavaScript: "javascript",
  TypeScript: "typescript",
  C: "c",
};

const ALLOWED_HTML_TAGS = [
  "div",
  "h3",
  "h4",
  "p",
  "ul",
  "ol",
  "li",
  "blockquote",
  "strong",
  "em",
  "br",
  "span",
  "hr",
];

const ALLOWED_HTML_ATTR = ["class"];

let mermaidIdCounter = 0;

const MermaidDiagram = ({ content, caption }) => {
  const containerRef = useRef(null);
  const id = `mermaid-${++mermaidIdCounter}`;

  useEffect(() => {
    if (!containerRef.current || !content) return;

    mermaid
      .render(id, content)
      .then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      })
      .catch(() => {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<p class="text-sm text-danger">Failed to render diagram.</p>`;
        }
      });
  }, [content, id]);

  return (
    <div className="my-6 mermaid-diagram-container">
      <div
        ref={containerRef}
        className="flex justify-center overflow-x-auto rounded-xl border border-border-default bg-bg-base p-4"
      />
      {caption && (
        <p className="mt-2 text-center text-xs text-text-muted italic">
          {caption}
        </p>
      )}
    </div>
  );
};

const CodeBlock = ({ content, language, highlightLines }) => {
  const prismLanguage =
    PRISM_LANGUAGE_MAP[language] || language?.toLowerCase() || "text";

  const lineProps = highlightLines?.length
    ? (lineNumber) => {
        const highlighted = highlightLines.includes(lineNumber);
        return highlighted
          ? { style: { backgroundColor: "rgba(255,255,255,0.07)" } }
          : {};
      }
    : undefined;

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border-default">
      {language && (
        <div className="flex items-center gap-2 border-b border-border-default bg-bg-soft/50 px-4 py-2">
          <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary uppercase">
            {language}
          </span>
        </div>
      )}
      <SyntaxHighlighter
        language={prismLanguage}
        style={oneDark}
        showLineNumbers
        wrapLines={!!lineProps}
        lineProps={lineProps}
        codeTagProps={{
          style: {
            background: "transparent",
            fontFamily: "inherit",
          },
        }}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "#010409",
          fontSize: "14px",
          lineHeight: "1.625",
        }}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
};

const TableBlock = ({ headers, rows }) => {
  if (!headers?.length || !rows?.length) return null;

  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border-default">
      <table className="algonotes-prep-table">
        <thead>
          <tr className="algonotes-prep-tr">
            {headers.map((header, i) => (
              <th key={i} className="algonotes-prep-th">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="algonotes-prep-tr">
              {row.map((cell, ci) => (
                <td key={ci} className="algonotes-prep-td">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SanitizedHtml = ({ html }) => {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ALLOWED_HTML_TAGS,
    ALLOWED_ATTR: ALLOWED_HTML_ATTR,
  });

  return (
    <div
      className="algonotes-prep-div"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
};

const blockTypeConfig = {
  text: { wrapperClass: "", icon: null },
  tip: { wrapperClass: "algonotes-prep-tip", icon: "💡" },
  warning: { wrapperClass: "algonotes-prep-warning", icon: "⚠️" },
  note: { wrapperClass: "algonotes-prep-note", icon: "📝" },
};

const BlockRenderer = ({ block }) => {
  if (!block) return null;

  const { type, title, content, metadata = {} } = block;

  // Render based on block type
  switch (type) {
    case "diagram":
      return (
        <div className="my-6">
          {title && (
            <h4 className="mb-2 text-sm font-semibold text-text-main">
              {title}
            </h4>
          )}
          <MermaidDiagram content={content} caption={metadata.caption} />
        </div>
      );

    case "code":
      return (
        <div className="my-6">
          {title && (
            <h4 className="mb-2 text-sm font-semibold text-text-main">
              {title}
            </h4>
          )}
          <CodeBlock
            content={content}
            language={metadata.language}
            highlightLines={metadata.highlightLines}
          />
        </div>
      );

    case "table":
      return (
        <div className="my-6">
          {title && (
            <h4 className="mb-2 text-sm font-semibold text-text-main">
              {title}
            </h4>
          )}
          <TableBlock headers={metadata.headers} rows={metadata.rows} />
        </div>
      );

    case "text":
    case "tip":
    case "warning":
    case "note": {
      const config = blockTypeConfig[type] || blockTypeConfig.text;
      return (
        <div className={`my-5 ${config.wrapperClass}`}>
          {title && (
            <div className="mb-2 flex items-center gap-2">
              {config.icon && <span className="text-base">{config.icon}</span>}
              <h4 className="text-sm font-semibold text-text-main">{title}</h4>
            </div>
          )}
          <SanitizedHtml html={content} />
        </div>
      );
    }

    default:
      return null;
  }
};

export default BlockRenderer;
