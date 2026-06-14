import React from "react";
import { Plus, Trash2 } from "lucide-react";

const DEFAULT_ROW = {
  step: "",
  state: "",
  action: "",
  result: "",
};

const TableBlockEditor = ({ block, onUpdate }) => {
  const rows = Array.isArray(block.table) ? block.table : [];

  const columns = Array.from(
    new Set(
      rows.flatMap((row) => Object.keys(row || {}))
    )
  );

  const safeColumns = columns.length > 0 ? columns : Object.keys(DEFAULT_ROW);

  const updateCell = (rowIndex, column, value) => {
    const updatedRows = rows.map((row, i) =>
      i === rowIndex ? { ...row, [column]: value } : row
    );

    onUpdate({ table: updatedRows });
  };

  const addRow = () => {
    const newRow = safeColumns.reduce((acc, col) => {
      acc[col] = "";
      return acc;
    }, {});

    onUpdate({
      table: [...rows, newRow],
    });
  };

  const deleteRow = (rowIndex) => {
    onUpdate({
      table: rows.filter((_, i) => i !== rowIndex),
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead className="bg-[var(--bg-soft)] text-[var(--text-muted)]">
            <tr>
              {safeColumns.map((column) => (
                <th
                  key={column}
                  className="border-b border-[var(--border-default)] px-3 py-2 font-bold capitalize"
                >
                  {column}
                </th>
              ))}

              <th className="w-12 border-b border-[var(--border-default)] px-3 py-2" />
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-[var(--border-default)] last:border-0">
                {safeColumns.map((column) => (
                  <td key={column} className="px-3 py-2 align-top">
                    <textarea
                      value={row?.[column] || ""}
                      onChange={(e) =>
                        updateCell(rowIndex, column, e.target.value)
                      }
                      rows={2}
                      className="w-full resize-y rounded-lg border border-[var(--border-default)] bg-[var(--bg-base)] px-2 py-1.5 text-xs text-[var(--text-main)] outline-none focus:border-[var(--primary)]"
                    />
                  </td>
                ))}

                <td className="px-3 py-2 align-top">
                  <button
                    type="button"
                    onClick={() => deleteRow(rowIndex)}
                    className="rounded-lg p-1.5 text-[var(--text-light)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[var(--border-default)] bg-[var(--bg-soft)] px-3 py-2">
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)] hover:underline"
        >
          <Plus size={13} />
          Add row
        </button>
      </div>
    </div>
  );
};

export default TableBlockEditor;