import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { VinRecord } from './database.types';

export function exportToPDF(record: VinRecord) {
  const doc = new jsPDF();

  const parseJsonArray = (json: unknown): string[] => {
    if (Array.isArray(json)) {
      return json.map(String);
    }
    return [];
  };

  const parseNumberArray = (json: unknown): number[] => {
    if (Array.isArray(json)) {
      return json.map(Number);
    }
    return [];
  };

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Focus Part', 105, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Management Piese Auto', 105, 28, { align: 'center' });

  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.5);
  doc.line(20, 32, 190, 32);

  let yPosition = 45;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Detalii Client', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Serie de Sasiu:', 20, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(record.vin_number, 65, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'bold');
  doc.text('Numar Inmatriculare:', 20, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(record.license_plate || 'N/A', 65, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'bold');
  doc.text('Nume Client:', 20, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(record.client_name, 65, yPosition);
  yPosition += 8;

  doc.setFont('helvetica', 'bold');
  doc.text('Data Crearii:', 20, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(record.created_at).toLocaleDateString('ro-RO'), 65, yPosition);
  yPosition += 15;

  if (record.notes) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Notite', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const notesLines = doc.splitTextToSize(record.notes, 170);
    doc.text(notesLines, 20, yPosition);
    yPosition += (notesLines.length * 5) + 10;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Piese Achizitionate', 20, yPosition);
  yPosition += 5;

  const parts = parseJsonArray(record.parts_bought);
  const serials = parseJsonArray(record.part_serial_numbers);
  const prices = parseNumberArray(record.part_prices);

  const tableData = parts.map((part, index) => [
    (index + 1).toString(),
    part,
    serials[index] || 'N/A',
    prices[index] ? `${prices[index].toFixed(2)} RON` : 'N/A'
  ]);

  const totalPrice = prices.reduce((sum, price) => sum + (price || 0), 0);

  autoTable(doc, {
    startY: yPosition,
    head: [['Nr.', 'Nume Piesa', 'Numar Serie', 'Pret']],
    body: tableData,
    foot: [['', '', 'Total:', `${totalPrice.toFixed(2)} RON`]],
    theme: 'grid',
    headStyles: {
      fillColor: [220, 38, 38],
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center'
    },
    footStyles: {
      fillColor: [240, 240, 240],
      textColor: 0,
      fontStyle: 'bold',
      halign: 'right'
    },
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 15 },
      1: { cellWidth: 70 },
      2: { cellWidth: 60 },
      3: { halign: 'right', cellWidth: 45 }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY || yPosition + 20;

  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.5);
  doc.line(20, doc.internal.pageSize.height - 20, 190, doc.internal.pageSize.height - 20);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(128, 128, 128);
  doc.text(
    `Generated on ${new Date().toLocaleString('ro-RO')}`,
    105,
    doc.internal.pageSize.height - 12,
    { align: 'center' }
  );

  const fileName = `Focus_Part_${record.vin_number}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
