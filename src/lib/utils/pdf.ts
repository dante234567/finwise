import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { fmt, fmtFecha } from './format'

/**
 * Calcula el total de un presupuesto
 */
const totalPresupuesto = (items: any[]) =>
  items.reduce((a, i) => a + Number(i.cantidad) * Number(i.precio), 0)

/**
 * Genera y descarga un PDF del presupuesto
 */
export const generarPDF = (presupuesto: any, perfil: any) => {
  const doc = (new jsPDF({ unit: 'mm', format: 'a4' }) as any)
  const azul: [number, number, number] = [10, 42, 92]
  const azulMid: [number, number, number] = [26, 74, 140]
  const gris: [number, number, number] = [100, 116, 139]
  const negro: [number, number, number] = [15, 23, 42]

  // ── Header ────────────────────────────────────────────────────────────────
  doc.setFillColor(...azul)
  doc.rect(0, 0, 210, 38, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('FinWise', 14, 16)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(160, 196, 240)
  doc.text('Gestión Inteligente para Emprendedores', 14, 22)

  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('PRESUPUESTO', 196, 16, { align: 'right' })

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(160, 196, 240)
  doc.text(`Fecha: ${fmtFecha(presupuesto.fecha || new Date().toISOString())}`, 196, 22, { align: 'right' })
  doc.text(`N° ${String(presupuesto.id || 'TEMP').toUpperCase()}`, 196, 28, { align: 'right' })

  // ── Info emisor / cliente ─────────────────────────────────────────────────
  doc.setTextColor(...negro)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('DE:', 14, 50)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...gris)
  doc.text(perfil.nombre || 'Usuario FinWise', 14, 56)
  doc.text(perfil.email || '', 14, 61)

  doc.setTextColor(...negro)
  doc.setFont('helvetica', 'bold')
  doc.text('PARA:', 130, 50)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...gris)
  doc.text(presupuesto.cliente, 130, 56)
  doc.text(`Tel: ${presupuesto.telefono || 'N/A'}`, 130, 61)

  // ── Tabla de ítems ────────────────────────────────────────────────────────
  const rows = presupuesto.items.map((item: any) => [
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
  const finalY = (doc as any).lastAutoTable.finalY + 6
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
  doc.text('Generado con FinWise · finwise.app', 105, 290, { align: 'center' })

  doc.save(`presupuesto-${presupuesto.cliente.replace(/\s/g, '-')}.pdf`)
}
