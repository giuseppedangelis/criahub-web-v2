// ============================================
// REPORT FILES
// Gera arquivos de relatorio estilizados e envia ao Storage
// ============================================

import { supabase } from './base'
import type { ReportFormat, ReportType } from '@/types'

const REPORTS_BUCKET = 'animals'
export const REPORT_LAYOUT_VERSION = 5

type ReportTone = 'primary' | 'success' | 'warning' | 'danger'

interface ReportMeta {
  title?: string
  subtitle?: string
  harasName?: string
  harasLocation?: string
  author?: string
  generatedAt?: string
  periodLabel?: string
  periodRange?: string
  orientation?: 'portrait' | 'landscape'
  layoutVersion?: number
}

interface ReportSummaryItem {
  label: string
  value: string
  tone?: ReportTone
}

interface ReportTable {
  headers: string[]
  rows: Array<Array<string | number | null>>
}

interface ReportSection {
  title: string
  description?: string
  bullets?: string[]
  table?: ReportTable
  note?: string
  code?: string
}

interface ReportVisualPayload {
  reportType?: ReportType
  meta?: ReportMeta
  summary?: ReportSummaryItem[]
  sections?: ReportSection[]
  tags?: string[]
  highlights?: string[]
  heroImageUrl?: string
}

const REPORT_THEMES: Record<ReportType, { primary: string; accent: string; accentSoft: string }> = {
  animal: { primary: '#6D28D9', accent: '#A78BFA', accentSoft: '#F3E8FF' },
  plantel: { primary: '#059669', accent: '#34D399', accentSoft: '#ECFDF5' },
  financeiro: { primary: '#B45309', accent: '#F59E0B', accentSoft: '#FFFBEB' },
  saude: { primary: '#DC2626', accent: '#F87171', accentSoft: '#FEF2F2' },
  premiacoes: { primary: '#4B5563', accent: '#9CA3AF', accentSoft: '#F9FAFB' },
  reproducao: { primary: '#DB2777', accent: '#F472B6', accentSoft: '#FDF2F8' },
}

const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  animal: 'Animal',
  plantel: 'Plantel',
  financeiro: 'Financeiro',
  saude: 'Saúde',
  premiacoes: 'Premiações',
  reproducao: 'Reprodução',
}

function sanitizeName(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 80)
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatDate(value?: string | null) {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'
  return parsed.toLocaleDateString('pt-BR')
}

function formatDateTime(value?: string | null) {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'
  return parsed.toLocaleString('pt-BR')
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'string') return value
  if (typeof value === 'number') return value.toString()
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não'
  return JSON.stringify(value, null, 2)
}

function normalizePayload(
  reportName: string,
  payload: Record<string, unknown>,
  reportType?: ReportType
) {
  const raw = payload as ReportVisualPayload
  const rawMeta = raw.meta ?? {}
  const inferredType =
    raw.reportType ||
    (payload.type as ReportType | undefined) ||
    reportType ||
    'animal'
  const theme = REPORT_THEMES[inferredType] ?? REPORT_THEMES.animal
  const title = rawMeta.title || reportName
  const subtitle =
    rawMeta.subtitle ||
    `Relatório ${REPORT_TYPE_LABELS[inferredType] || inferredType}`

  const meta: ReportMeta = {
    title,
    subtitle,
    harasName: rawMeta.harasName || 'CriaHub',
    harasLocation: rawMeta.harasLocation || 'Gestão Completa do Haras',
    author: rawMeta.author || 'Equipe CriaHub',
    generatedAt: rawMeta.generatedAt || new Date().toISOString(),
    periodLabel: rawMeta.periodLabel || 'Atual',
    periodRange: rawMeta.periodRange || '',
    orientation: rawMeta.orientation || 'portrait',
    layoutVersion: rawMeta.layoutVersion ?? REPORT_LAYOUT_VERSION,
  }

  let sections: ReportSection[] | undefined = raw.sections
  const summary = raw.summary
  if (!sections || sections.length === 0) {
    sections = [
      {
        title: 'Parâmetros do Relatório',
        description: 'Configurações utilizadas na geração deste documento.',
        code: JSON.stringify(payload, null, 2),
      },
    ]
  }

  return {
    theme,
    reportType: inferredType,
    meta,
    summary: summary ?? [],
    sections,
    tags: raw.tags ?? [],
    highlights: raw.highlights ?? [],
    heroImageUrl: raw.heroImageUrl ?? undefined,
  }
}

async function hydrateHarasMeta(harasId: string, payload: Record<string, unknown>) {
  const raw = payload as ReportVisualPayload & { type?: ReportType }
  const meta: ReportMeta = { ...(raw.meta ?? {}) }

  const needsName = !meta.harasName || meta.harasName.trim() === '' || meta.harasName === 'Haras'
  const needsLocation =
    !meta.harasLocation ||
    meta.harasLocation.trim() === '' ||
    meta.harasLocation === 'Gestão Completa do Haras'

  if (!needsName && !needsLocation) {
    return payload
  }

  const { data, error } = await supabase
    .from('haras')
    .select('nome, cidade, estado')
    .eq('id', harasId)
    .single()

  if (error || !data) {
    return payload
  }

  if (needsName && data.nome) {
    meta.harasName = data.nome
  }
  if (needsLocation) {
    meta.harasLocation = [data.cidade, data.estado].filter(Boolean).join(' • ')
  }

  return {
    ...payload,
    meta,
    reportType: raw.reportType || raw.type,
  }
}

function renderSummaryCards(summary: ReportSummaryItem[], theme: { accent: string; accentSoft: string }) {
  if (!summary || summary.length === 0) return ''
  const cards = summary
    .map((item) => {
      const toneClass = item.tone ? `summary-card--${item.tone}` : ''
      return `
        <div class="summary-card ${toneClass}">
          <div class="summary-label">${escapeHtml(item.label)}</div>
          <div class="summary-value">${escapeHtml(formatValue(item.value))}</div>
        </div>
      `
    })
    .join('')

  return `
    <section class="section">
      <div class="section-header">
        <h2>Resumo Executivo</h2>
        <span class="pill" style="background:${theme.accentSoft};color:${theme.accent}">Destaques</span>
      </div>
      <div class="summary-grid">
        ${cards}
      </div>
    </section>
  `
}

function renderTags(tags: string[]) {
  const sanitized = (tags || []).filter((tag) => tag && tag.trim())
  if (sanitized.length === 0) return ''
  return `
    <div class="tag-list">
      ${sanitized.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
    </div>
  `
}

function renderHighlights(highlights: string[]) {
  if (!highlights || highlights.length === 0) return ''
  return `
    <div class="callout">
      <h4>Alertas e Destaques</h4>
      <ul>
        ${highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </div>
  `
}

function renderSection(section: ReportSection) {
  const bullets = section.bullets?.length
    ? `<ul class="bullets">${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : ''
  const table = section.table
    ? `
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              ${section.table.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${section.table.rows
              .map(
                (row) =>
                  `<tr>${row.map((cell) => `<td>${escapeHtml(formatValue(cell))}</td>`).join('')}</tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `
    : ''
  const note = section.note ? `<div class="note">${escapeHtml(section.note)}</div>` : ''
  const code = section.code
    ? `<pre class="code-block">${escapeHtml(section.code)}</pre>`
    : ''

  return `
    <section class="section">
      <div class="section-header">
        <h2>${escapeHtml(section.title)}</h2>
      </div>
      ${section.description ? `<p class="section-desc">${escapeHtml(section.description)}</p>` : ''}
      ${bullets}
      ${table}
      ${note}
      ${code}
    </section>
  `
}

function buildReportHtml(
  reportName: string,
  payload: Record<string, unknown>,
  reportType?: ReportType
) {
  const normalized = normalizePayload(reportName, payload, reportType)
  const { theme, meta, summary, sections, tags, highlights, heroImageUrl } = normalized
  const typeLabel = REPORT_TYPE_LABELS[normalized.reportType] || 'Relatório'
  const orientation = meta.orientation || 'portrait'
  const reportClass = orientation === 'landscape' ? 'report report--landscape' : 'report'

  const heroImage = heroImageUrl
    ? `
      <div class="hero-photo">
        <img src="${escapeHtml(heroImageUrl)}" alt="${escapeHtml(meta.title || '')}" crossorigin="anonymous" />
      </div>
    `
    : ''

  const html = `
    <style>
          :root {
            --primary: ${theme.primary};
            --accent: ${theme.accent};
            --accent-soft: ${theme.accentSoft};
            --ink: #0f172a;
            --muted: #64748b;
            --surface: #ffffff;
            --surface-alt: #f8fafc;
            --border: #e2e8f0;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
            background: #eef2f7;
            color: var(--ink);
          }
          .report-shell {
            width: 100%;
            padding: 28px 0 32px;
          }
          .report {
            width: 794px;
            margin: 0 auto;
            background: var(--surface);
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 28px 60px rgba(15, 23, 42, 0.18);
            padding-bottom: 24px;
          }
          .report--landscape {
            width: 1123px;
          }
          .hero {
            position: relative;
            padding: 40px 48px 36px;
            color: #ffffff;
            background:
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.18), transparent 50%),
              linear-gradient(135deg, var(--primary) 0%, #111827 100%);
          }
          .hero-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 20px;
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .brand-mark {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 1px;
          }
          .brand-name {
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 0.4px;
          }
          .brand-sub {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
          }
          .hero-tag {
            padding: 6px 14px;
            border-radius: 999px;
            font-size: 12px;
            background: rgba(255, 255, 255, 0.18);
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .hero-title {
            font-size: 28px;
            font-weight: 700;
            margin: 0 0 6px;
          }
          .hero-subtitle {
            font-size: 14px;
            margin: 0;
            color: rgba(255, 255, 255, 0.75);
          }
          .hero-photo {
            position: absolute;
            right: 42px;
            bottom: -32px;
            width: 120px;
            height: 120px;
            border-radius: 28px;
            overflow: hidden;
            border: 4px solid rgba(255, 255, 255, 0.75);
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.3);
            background: rgba(255, 255, 255, 0.2);
          }
          .hero-photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }
          .meta-grid {
            margin-top: 22px;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
          }
          .meta-card {
            background: rgba(255, 255, 255, 0.16);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 14px;
            padding: 12px 14px;
          }
          .meta-card span {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.75);
            display: block;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.7px;
          }
          .meta-card strong {
            font-size: 13px;
            display: block;
          }
          .meta-card small {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.7);
          }
          .content {
            padding: 24px 48px 32px;
            background: var(--surface);
          }
          .tag-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 12px 0 4px;
          }
          .tag {
            padding: 4px 10px;
            border-radius: 999px;
            background: var(--accent-soft);
            color: var(--primary);
            font-size: 11px;
            font-weight: 600;
          }
          .section {
            padding: 24px 48px;
            border-bottom: 1px solid var(--border);
          }
          .section:last-of-type {
            border-bottom: none;
          }
          .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
          }
          .section-header h2 {
            margin: 0;
            font-size: 18px;
          }
          .section-desc {
            margin: 0 0 12px;
            color: var(--muted);
            font-size: 13px;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
          }
          .summary-card {
            background: var(--surface-alt);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 14px;
            min-height: 80px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .summary-card--primary { border-color: var(--accent); background: var(--accent-soft); }
          .summary-card--success { border-color: #16a34a; background: #ecfdf5; }
          .summary-card--warning { border-color: #f59e0b; background: #fffbeb; }
          .summary-card--danger { border-color: #ef4444; background: #fef2f2; }
          .summary-label {
            font-size: 11px;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 0.6px;
          }
          .summary-value {
            font-size: 18px;
            font-weight: 700;
            margin-top: 8px;
          }
          .pill {
            padding: 4px 10px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 600;
          }
          .bullets {
            margin: 0;
            padding-left: 18px;
            color: var(--ink);
            font-size: 13px;
            display: grid;
            gap: 6px;
          }
          .table-wrapper {
            border: 1px solid var(--border);
            border-radius: 12px;
            overflow: hidden;
            margin-top: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          th {
            background: #f1f5f9;
            color: var(--ink);
            padding: 10px 12px;
            text-align: left;
            font-weight: 600;
          }
          td {
            padding: 10px 12px;
            border-top: 1px solid var(--border);
            color: #1f2937;
          }
          tr:nth-child(even) td {
            background: #f8fafc;
          }
          .note {
            margin-top: 12px;
            padding: 12px 14px;
            background: var(--accent-soft);
            border-left: 3px solid var(--accent);
            border-radius: 10px;
            font-size: 12px;
            color: #1f2937;
          }
          .code-block {
            margin-top: 12px;
            padding: 12px;
            background: #0f172a;
            color: #e2e8f0;
            border-radius: 12px;
            font-size: 10px;
            white-space: pre-wrap;
          }
          .callout {
            margin-top: 16px;
            padding: 16px;
            background: #0f172a;
            border-radius: 16px;
            color: #e2e8f0;
          }
          .callout h4 {
            margin: 0 0 8px;
            font-size: 14px;
          }
          .callout ul {
            margin: 0;
            padding-left: 16px;
            font-size: 12px;
          }
          .footer {
            background: #0f172a;
            color: rgba(255, 255, 255, 0.7);
            padding: 16px 48px;
            font-size: 11px;
            display: flex;
            justify-content: space-between;
          }
        </style>
        <div class="report-shell">
          <div class="${reportClass}">
            <div class="hero">
              <div class="hero-top">
                <div class="brand">
                  <div class="brand-mark">CH</div>
                  <div>
                    <div class="brand-name">CriaHub</div>
                    <div class="brand-sub">Gestão Completa do Haras</div>
                  </div>
                </div>
                <div class="hero-tag">${escapeHtml(typeLabel)}</div>
              </div>
              <h1 class="hero-title">${escapeHtml(meta.title || reportName)}</h1>
              <p class="hero-subtitle">${escapeHtml(meta.subtitle || '')}</p>
              <div class="meta-grid">
                <div class="meta-card">
                  <span>Haras</span>
                  <strong>${escapeHtml(meta.harasName || '-')}</strong>
                  <small>${escapeHtml(meta.harasLocation || '')}</small>
                </div>
                <div class="meta-card">
                  <span>Período</span>
                  <strong>${escapeHtml(meta.periodLabel || '-')}</strong>
                  <small>${escapeHtml(meta.periodRange || '')}</small>
                </div>
                <div class="meta-card">
                  <span>Gerado em</span>
                  <strong>${escapeHtml(formatDateTime(meta.generatedAt))}</strong>
                  <small>${escapeHtml(meta.author || '')}</small>
                </div>
              </div>
              ${heroImage}
            </div>
            <div class="content">
              ${renderTags(tags)}
              ${renderHighlights(highlights)}
            </div>
            ${renderSummaryCards(summary, theme)}
            ${sections.map((section) => renderSection(section)).join('')}
            <div class="footer">
              <span>CriaHub • ${escapeHtml(typeLabel)}</span>
              <span>Gerado em ${escapeHtml(formatDate(meta.generatedAt))}</span>
            </div>
          </div>
        </div>
  `
  return html
}

async function waitForImages(container: HTMLElement) {
  const images = Array.from(container.querySelectorAll('img'))
  if (images.length === 0) return
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve()
            return
          }
          img.onload = () => resolve()
          img.onerror = () => resolve()
        })
    )
  )
}

async function renderPdfBlob(
  reportName: string,
  payload: Record<string, unknown>,
  reportType?: ReportType
) {
  if (typeof window === 'undefined') {
    throw new Error('Geração de PDF disponível apenas no navegador.')
  }

  const html = buildReportHtml(reportName, payload, reportType)
  const wrapper = document.createElement('div')
  wrapper.style.position = 'fixed'
  wrapper.style.left = '0'
  wrapper.style.top = '0'
  wrapper.style.zIndex = '-1'
  wrapper.style.width = '794px'
  wrapper.style.background = '#eef2f7'
  wrapper.style.pointerEvents = 'none'
  wrapper.innerHTML = html
  document.body.appendChild(wrapper)

  try {
    await waitForImages(wrapper)

    const normalized = normalizePayload(reportName, payload, reportType)
    const orientation = normalized.meta.orientation || 'portrait'
    wrapper.style.width = orientation === 'landscape' ? '1123px' : '794px'

    const { default: html2canvas } = await import('html2canvas')
    const { jsPDF } = await import('jspdf')

    const canvas = await html2canvas(wrapper, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#eef2f7',
      scrollX: 0,
      scrollY: 0,
      windowWidth: wrapper.scrollWidth,
      windowHeight: wrapper.scrollHeight,
      logging: false,
    })

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Não foi possível renderizar o PDF.')
    }

    const imgData = canvas.toDataURL('image/jpeg', 0.98)
    const pdf = new jsPDF({
      orientation,
      unit: 'pt',
      format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const marginTop = 36
    const marginRight = 24
    const marginBottom = 70
    const marginLeft = 24
    const contentWidth = pageWidth - marginLeft - marginRight
    const visibleHeight = pageHeight - marginTop - marginBottom
    const ratio = contentWidth / canvas.width
    const pageHeightPx = Math.floor(visibleHeight / ratio)
    const sliceCanvas = document.createElement('canvas')
    const sliceContext = sliceCanvas.getContext('2d')
    if (!sliceContext) {
      throw new Error('Não foi possível preparar o PDF.')
    }

    let offsetY = 0
    while (offsetY < canvas.height) {
      const sliceHeight = Math.min(pageHeightPx, canvas.height - offsetY)
      sliceCanvas.width = canvas.width
      sliceCanvas.height = sliceHeight
      sliceContext.clearRect(0, 0, sliceCanvas.width, sliceCanvas.height)
      sliceContext.drawImage(
        canvas,
        0,
        offsetY,
        canvas.width,
        sliceHeight,
        0,
        0,
        canvas.width,
        sliceHeight
      )

      const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.98)
      const renderedHeight = sliceHeight * ratio
      pdf.addImage(sliceData, 'JPEG', marginLeft, marginTop, contentWidth, renderedHeight)

      offsetY += sliceHeight
      if (offsetY < canvas.height) {
        pdf.addPage()
      }
    }

    return pdf.output('blob') as Blob
  } finally {
    document.body.removeChild(wrapper)
  }
}

export async function uploadReportFile(options: {
  harasId: string
  reportName: string
  format: ReportFormat
  payload: Record<string, unknown>
  reportType?: ReportType
}) {
  const { harasId, reportName, format, payload, reportType } = options
  const safeName = sanitizeName(reportName) || 'relatorio'
  const timestamp = Date.now()

  const storedFormat: ReportFormat = 'pdf'
  const notice =
    format === 'pdf' ? null : 'Geramos um PDF premium para garantir o layout.'

  const filePath = `${harasId}/reports/${safeName}-${timestamp}.pdf`

  const enrichedPayload = await hydrateHarasMeta(harasId, payload)
  const pdfBlob = await renderPdfBlob(reportName, enrichedPayload, reportType)

  const { error } = await supabase
    .storage
    .from(REPORTS_BUCKET)
    .upload(filePath, pdfBlob, { contentType: 'application/pdf', upsert: false })

  if (error) {
    throw error
  }

  const { data } = supabase.storage.from(REPORTS_BUCKET).getPublicUrl(filePath)
  if (!data?.publicUrl) {
    throw new Error('Erro ao obter URL do relatorio.')
  }

  return {
    fileUrl: data.publicUrl,
    sizeBytes: pdfBlob.size,
    storedFormat,
    notice,
  }
}
