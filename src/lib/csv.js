/**
 * Minimal CSV reader for price spreadsheets. Handles quoted fields, escaped
 * quotes (""), CRLF line endings, a UTF-8 BOM, and both "," and ";"
 * separators (French-language Excel saves CSV with ";").
 * @param {string} text
 * @returns {string[][]} rows of cells, blank lines removed
 */
export function parseCsv(text) {
  const clean = text.replace(/^﻿/, '')
  const firstLine = clean.split(/\r?\n/, 1)[0] ?? ''
  const separator = (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ';' : ','

  const rows = []
  let row = []
  let cell = ''
  let quoted = false

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i]
    if (quoted) {
      if (char === '"' && clean[i + 1] === '"') {
        cell += '"'
        i++
      } else if (char === '"') {
        quoted = false
      } else {
        cell += char
      }
    } else if (char === '"') {
      quoted = true
    } else if (char === separator) {
      row.push(cell)
      cell = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && clean[i + 1] === '\n') i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else {
      cell += char
    }
  }
  row.push(cell)
  rows.push(row)

  return rows.map((cells) => cells.map((value) => value.trim())).filter((cells) => cells.some(Boolean))
}

/** Turns one CSV value into a cell, quoting when needed. */
const csvCell = (value) => {
  const text = String(value ?? '')
  return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** @param {string[][]} rows */
export const toCsv = (rows) => rows.map((cells) => cells.map(csvCell).join(',')).join('\r\n')
