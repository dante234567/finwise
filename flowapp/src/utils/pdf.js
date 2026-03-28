// ─── Generación de PDF para presupuestos con jsPDF ──────────────────────────
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { fmt, fmtFecha, totalPresupuesto } from './format'

/**
 * Genera y descarga un PDF del presupuesto
 * @param {object} presupuesto
 * @param {object} perfil
 */
export const generarPDF = (presupuesto, perfil) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const azul    = [10, 42, 92]
  const azulMid = [26, 74, 140]
  const gris    = [100, 116, 139]
  const negro   = [15, 23, 42]

  // ── Header ────────────────────────────────────────────────────────────────
  doc.setFillColor(...azul)
  doc.rect(0, 0, 210, 38, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('FlowApp', 14, 16)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(160, 196, 240)
  doc.text('Gestión para emprendedores', 14, 22)

  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('PRESUPUESTO', 196, 16, { align: 'right' })

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(160, 196, 240)
  doc.text(`Fecha: ${fmtFecha(presupuesto.fecha)}`, 196, 22, { align: 'right' })
  doc.text(`N° ${presupuesto.id.toUpperCase()}`, 196, 28, { align: 'right' })

  // ── Info emisor / cliente ─────────────────────────────────────────────────
  doc.setTextColor(...negro)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('DE:', 14, 50)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...gris)
  doc.text(perfil.nombre, 14, 56)
  doc.text(perfil.email, 14, 61)

  doc.setTextColor(...negro)
  doc.setFont('helvetica', 'bold')
  doc.text('PARA:', 130, 50)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...gris)
  doc.text(presupuesto.cliente, 130, 56)
  doc.text(`Tel: ${presupuesto.telefono}`, 130, 61)

  // ── Tabla de ítems ────────────────────────────────────────────────────────
  const rows = presupuesto.items.map((item) => [
    item.descripcion,
    item.cantidad,
    fmt(item.precio),
    fmt(item.cantidad * item.precio),
  ])

  autoTable(doc, {
    startY: 72,
    head: [['Descripción', 'Cant.', 'Precio unit.', 'Subtotal']],
    body: rows,
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: azulMid, textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [240, 245, 255] },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right', fontStyle: 'bold' },
    },
  })

  // ── Total ─────────────────────────────────────────────────────────────────
  const finalY = doc.lastAutoTable.finalY + 6
  doc.setFillColor(...azul)
  doc.roundedRect(130, finalY, 66, 14, 3, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL:', 136, finalY + 9)
  doc.text(fmt(totalPresupuesto(presupuesto.items)), 194, finalY + 9, { align: 'right' })

  // ── Notas ─────────────────────────────────────────────────────────────────
  if (presupuesto.notas) {
    doc.setTextColor(...gris)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.text(`Notas: ${presupuesto.notas}`, 14, finalY + 24)
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  doc.setTextColor(...gris)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.text('Generado con FlowApp · flowapp.ar', 105, 290, { align: 'center' })

  doc.save(`presupuesto-${presupuesto.cliente.replace(/\s/g, '-')}-${presupuesto.id}.pdf`)
}
