import { CalEvent } from '@/model/CalEvent';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/*
 * This function is used to export the events to a CSV file.
 */
export function exportToCSV(filename: string, rows: CalEvent[]) {
  const processRow = (row: CalEvent) => {
    const values = [
      row.startDate.toLocaleDateString('fr-CH', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      row.endDate.toLocaleDateString('fr-CH', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      (row.endDate.getTime() - row.startDate.getTime()) / 3600000,
      row.summary,
    ];
    return values.join(';');
  };

  const csvHeader = 'Start;End;Total;Title\n';
  const csvContent = rows.map(processRow).join('\n');

  const csv = csvHeader + csvContent;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/*
 * This function is used to export the events to a PDF file.
 */
export function exportToPDF(filename: string, rows: CalEvent[]) {
  const doc = new jsPDF('p', 'pt', 'a4');

  // Add a title to the PDF document.
  doc.setFontSize(20);
  doc.text(filename, 40, 40);

  const tableColumn = ['Start', 'End', 'Total', 'Title'];
  const tableRows = rows.map((row) => [
    row.startDate.toLocaleDateString('fr-CH', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
    row.endDate.toLocaleDateString('fr-CH', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
    (row.endDate.getTime() - row.startDate.getTime()) / 3600000 + 'h',
    row.summary,
  ]);
  const tableFooter = [
    'Total',
    '',
    rows.reduce(
      (total, event) =>
        total + (event.endDate.getTime() - event.startDate.getTime()) / 3600000,
      0
    ) + 'h',
    '',
  ];
  // @ts-ignore
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    foot: [tableFooter],
    startY: 60,
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
    footStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
  });
  doc.save(filename);
}
