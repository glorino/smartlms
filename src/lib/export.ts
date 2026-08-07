export interface Column<T> {
  key: string;
  label: string;
  format?: (value: any, row: T) => string;
}

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  columns: Column<T>[],
  filename: string
): void {
  const headers = columns.map((col) => col.label);
  const rows = data.map((row) =>
    columns.map((col) => {
      let value = col.key.split(".").reduce((obj: any, key) => obj?.[key], row);
      if (col.format) {
        value = col.format(value, row);
      }
      if (value === null || value === undefined) value = "";
      const strValue = String(value);
      if (strValue.includes(",") || strValue.includes('"') || strValue.includes("\n")) {
        return `"${strValue.replace(/"/g, '""')}"`;
      }
      return strValue;
    })
  );

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  downloadFile(csv, `${filename}.csv`, "text/csv;charset=utf-8;");
}

export function exportToPDF<T extends Record<string, any>>(
  data: T[],
  columns: Column<T>[],
  title: string,
  filename: string
): void {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const headers = columns.map((col) => `<th style="padding:12px 16px;text-align:left;background:#4f46e5;color:white;font-weight:600;border-bottom:2px solid #3730a3;">${col.label}</th>`).join("");

  const rows = data
    .map(
      (row, idx) =>
        `<tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f9fafb"};">
          ${columns
            .map((col) => {
              let value = col.key.split(".").reduce((obj: any, key) => obj?.[key], row);
              if (col.format) {
                value = col.format(value, row);
              }
              if (value === null || value === undefined) value = "—";
              return `<td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#374151;">${value}</td>`;
            })
            .join("")}
        </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @media print {
      body { margin: 0; }
      .no-print { display: none !important; }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1f2937; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #e5e7eb; }
    .brand { display: flex; align-items: center; gap: 12px; }
    .logo { width: 40px; height: 40px; background: #4f46e5; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 18px; }
    .brand-text h1 { font-size: 24px; font-weight: 700; color: #111827; }
    .brand-text p { font-size: 14px; color: #6b7280; margin-top: 2px; }
    .meta { text-align: right; }
    .meta .title { font-size: 28px; font-weight: 700; color: #111827; margin-bottom: 4px; }
    .meta .date { font-size: 13px; color: #6b7280; }
    .meta .count { font-size: 14px; color: #4f46e5; font-weight: 600; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 14px; }
    tr:last-child td { border-bottom: none; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 12px; color: #9ca3af; }
    .print-btn { position: fixed; bottom: 24px; right: 24px; padding: 12px 24px; background: #4f46e5; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; box-shadow: 0 4px 12px rgba(79,70,229,0.4); }
    .print-btn:hover { background: #4338ca; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <div class="logo">S</div>
      <div class="brand-text">
        <h1>SmartLMS</h1>
        <p>Learning Management System</p>
      </div>
    </div>
    <div class="meta">
      <div class="title">${title}</div>
      <div class="date">Generated: ${date}</div>
      <div class="count">${data.length} record${data.length !== 1 ? "s" : ""}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>${headers}</tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div class="footer">
    <span>SmartLMS Analytics Report</span>
    <span>Page 1 of 1</span>
  </div>

  <button class="print-btn no-print" onclick="window.print()">Print / Save as PDF</button>
</body>
</html>`;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}

export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
