// scripts/find-unused-assets.js
// Usage: node scripts/find-unused-assets.js
// Scans src for references to files under src/assets.

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(process.cwd(), 'client', 'src');
const ASSETS_DIR = path.join(SRC_DIR, 'assets');

function listFiles(dir) {
    const res = [];
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) res.push(...listFiles(full));
        else res.push(full);
    }
    return res;
}

function scanSourceFor(assetRelPath) {
    const contentIndex = [];
    function walk(dir) {
        for (const name of fs.readdirSync(dir)) {
            const full = path.join(dir, name);
            const stat = fs.statSync(full);
            if (stat.isDirectory()) walk(full);
            else {
                const text = fs.readFileSync(full, 'utf8');
                if (text.includes(assetRelPath)) contentIndex.push(full);
            }
        }
    }
    walk(SRC_DIR);
    return contentIndex;
}

function main() {
    if (!fs.existsSync(ASSETS_DIR)) {
        console.log('No assets dir found at', ASSETS_DIR);
        return;
    }
    const assets = listFiles(ASSETS_DIR);
    const unused = [];
    for (const a of assets) {
        const rel = path.relative(SRC_DIR, a).replaceAll('\\', '/');
        const refs = scanSourceFor(rel);
        if (refs.length === 0) unused.push(rel);
    }
    console.log('Assets total:', assets.length);
    console.log('Unused assets:', unused.length);
    for (const u of unused) console.log(u);
}

main();