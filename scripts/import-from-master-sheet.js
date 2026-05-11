/**
 * Rebuilds public/data/value.json and segmentation_analysis.json from the Excel Master Sheet.
 * Each row is one leaf path: Region → Segment type → Sub-segment → Sub-segment 1 → years.
 * No aggregate-only rows are written, so charts that sum leaves do not double-count.
 */

const fs = require('fs')
const path = require('path')
const XLSX = require('xlsx')

const ROOT = path.join(__dirname, '..')
const XLSX_PATH = path.join(
  ROOT,
  'Final Updated_Dataset-Global Monoclonal Antibodies for Cancer and Non-Cancer Diagnostics Market.xlsx'
)

function parseYearColumns(headerRow) {
  const yearCols = []
  for (let c = 4; c < headerRow.length; c++) {
    const h = headerRow[c]
    if (h === '' || h === undefined || h === null) continue
    const year = typeof h === 'number' ? String(Math.round(h)) : String(h).trim()
    if (/^20\d{2}$/.test(year)) yearCols.push({ col: c, year })
  }
  return yearCols
}

function structureOnly(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj
  const keys = Object.keys(obj)
  const hasYear = keys.some((k) => /^\d{4}$/.test(k))
  if (hasYear) return {}
  const out = {}
  for (const k of keys) out[k] = structureOnly(obj[k])
  return out
}

function main() {
  if (!fs.existsSync(XLSX_PATH)) {
    console.error('Missing workbook:', XLSX_PATH)
    process.exit(1)
  }

  const wb = XLSX.readFile(XLSX_PATH)
  const sheet = wb.Sheets['Master Sheet']
  if (!sheet) {
    console.error('Workbook has no "Master Sheet" tab.')
    process.exit(1)
  }

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })
  const headerRow = rows[5]
  const yearCols = parseYearColumns(headerRow)
  if (yearCols.length === 0) {
    console.error('No year columns found in header row (row index 5).')
    process.exit(1)
  }

  const valueTree = {}

  for (let i = 6; i < rows.length; i++) {
    const row = rows[i]
    const region = String(row[0] ?? '').trim()
    const segmentType = String(row[1] ?? '').trim()
    const sub = String(row[2] ?? '').trim()
    const sub1 = String(row[3] ?? '').trim()

    if (!region || !segmentType || !sub || !sub1) continue

    if (!valueTree[region]) valueTree[region] = {}
    if (!valueTree[region][segmentType]) valueTree[region][segmentType] = {}
    if (!valueTree[region][segmentType][sub]) valueTree[region][segmentType][sub] = {}

    const leaf = {}
    for (const { col, year } of yearCols) {
      const raw = row[col]
      if (raw === '' || raw === null || raw === undefined) continue
      const num = typeof raw === 'number' ? raw : parseFloat(String(raw).replace(/,/g, ''))
      if (!Number.isFinite(num)) continue
      leaf[year] = num
    }

    valueTree[region][segmentType][sub][sub1] = leaf
  }

  const outDir = path.join(ROOT, 'public', 'data')
  fs.mkdirSync(outDir, { recursive: true })

  const valuePath = path.join(outDir, 'value.json')
  const segPath = path.join(outDir, 'segmentation_analysis.json')

  fs.writeFileSync(valuePath, JSON.stringify(valueTree, null, 2))
  fs.writeFileSync(segPath, JSON.stringify(structureOnly(valueTree), null, 2))

  const regionCount = Object.keys(valueTree).length
  let leafRows = 0
  for (const r of Object.values(valueTree)) {
    for (const st of Object.values(r)) {
      for (const p of Object.values(st)) {
        leafRows += Object.keys(p).length
      }
    }
  }

  console.log('Wrote', valuePath)
  console.log('Wrote', segPath)
  console.log('Regions:', regionCount, '| Leaf paths (inner keys):', leafRows)
}

main()
