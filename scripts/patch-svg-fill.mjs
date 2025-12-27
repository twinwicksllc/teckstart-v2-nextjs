#!/usr/bin/env node
import fs from 'fs'

/*
Usage:
  node scripts/patch-svg-fill.mjs public/teckstart-source.svg 1,2,3,4

This will set the group-level fill to #0E2D4C and add fill="#FEB33C" to the specified path indices (1-based).
*/

const [,, filePath, indicesArg] = process.argv
if (!filePath || !indicesArg) {
  console.error('Usage: node scripts/patch-svg-fill.mjs <svg-file> <comma-separated-path-indices>')
  process.exit(1)
}

const indices = indicesArg.split(',').map(s => parseInt(s.trim(), 10)).filter(n => Number.isFinite(n) && n > 0)
const svg = fs.readFileSync(filePath, 'utf8')

// Update group-level fill to Teckstart navy
let out = svg.replace(/(\bfill=")#[0-9A-Fa-f]{3,6}(")/, '$1#0E2D4C$2')

// Split paths while preserving content
const parts = out.split(/(<path\b[^>]*>)/)
let pathCounter = 0
for (let i = 0; i < parts.length; i++) {
  const m = parts[i].match(/^<path\b[\s\S]*>$/)
  if (m) {
    pathCounter += 1
    if (indices.includes(pathCounter)) {
      // Force orange fill on this path
      let p = parts[i]
      if (/\bfill=/.test(p)) {
        p = p.replace(/\bfill="[^"]*"/, 'fill="#FEB33C"')
      } else {
        p = p.replace(/>$/, ' fill="#FEB33C">')
      }
      parts[i] = p
    } else {
      // Ensure non-selected paths do not override group fill with other colors
      let p = parts[i]
      // If a fill exists and is not orange, remove it to inherit navy
      p = p.replace(/\bfill="(?!#FEB33C)[^"]*"/g, '')
      parts[i] = p
    }
  }
}

const updated = parts.join('')
fs.writeFileSync(filePath, updated, 'utf8')
console.log(`Patched ${filePath}. Orange paths: ${indices.join(', ') || '(none)'}; group fill set to #0E2D4C.`)
