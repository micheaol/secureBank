export function EvidenceSectionView({ section, onAddEvidence }) {
  if (section.type === "log") {
    return (
      <div className="rounded-md border border-divider bg-neutral-100 p-3 font-mono text-[13px] leading-[1.65]">
        {section.lines.map((line, index) => (
          <div key={index} className="flex items-start justify-between gap-3">
            <span className="whitespace-pre-wrap">{line}</span>
            <button
              type="button"
              onClick={() => onAddEvidence({ source: section.title, text: line })}
              className="shrink-0 font-mono text-[10px] uppercase text-accent-700 hover:underline"
            >
              + Evidence
            </button>
          </div>
        ))}
      </div>
    );
  }

  if (section.type === "table") {
    return (
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-divider text-left font-mono text-[11px] uppercase tracking-[0.08em] text-neutral-600">
            {section.columns.map((column) => (
              <th key={column} className="py-2 font-normal">
                {column}
              </th>
            ))}
            <th className="py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-divider">
          {section.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-2 font-mono text-[12px]">
                  {cell}
                </td>
              ))}
              <td className="py-2 text-right">
                <button
                  type="button"
                  onClick={() => onAddEvidence({ source: section.title, text: row.join(" · ") })}
                  className="font-mono text-[10px] uppercase text-accent-700 hover:underline"
                >
                  + Evidence
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return null;
}
