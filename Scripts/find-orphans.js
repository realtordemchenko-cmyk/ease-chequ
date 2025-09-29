// scripts/find-orphans.js
// Usage: node scripts/find-orphans.js
// Detects TS/TSX orphans under src/ by building a naive import graph.
// Note: This is conservative; double-check before deletion.

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(process.cwd(), 'client', 'src');
const ENTRY_FILES = new Set([
    'main.tsx',
    'main.ts',
    'index.tsx',
    'index.ts',
    'router/index.ts',
    'router/index.tsx',
]);

const exts = new Set(['.ts', '.tsx', '.js', '.jsx']);
const files = new Set();
const importsMap = new Map();

function listFiles(dir) {
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) listFiles(full);
        else if (exts.has(path.extname(name))) files.add(full);
    }
}

function readImports(file) {
    const content = fs.readFileSync(file, 'utf8');
    const regex =
        /\bimport\s+(?:[\s\S]*?)\s+from\s+['"]([^'"]+)['"]|\brequire\(['"]([^'"]+)['"]\)/g;
    const res = [];
    let match;
    while ((match = regex.exec(content))) {
        const spec = match[1] || match[2];
        if (!spec) continue;
        // Consider only relative imports
        if (spec.startsWith('.') || spec.startsWith('/')) res.push(spec);
    }
    return res;
}

function resolveImport(fromFile, spec) {
    const baseDir = path.dirname(fromFile);
    const tryPaths = [];
    const raw = path.resolve(baseDir, spec);
    // Try exact file, then index
    tryPaths.push(raw);
    tryPaths.push(raw + '.ts');
    tryPaths.push(raw + '.tsx');
    tryPaths.push(raw + '.js');
    tryPaths.push(raw + '.jsx');
    tryPaths.push(path.join(raw, 'index.ts'));
    tryPaths.push(path.join(raw, 'index.tsx'));
    tryPaths.push(path.join(raw, 'index.js'));
    tryPaths.push(path.join(raw, 'index.jsx'));
    for (const p of tryPaths) {
        if (files.has(p)) return p;
        if (fs.existsSync(p)) return p;
    }
    return null;
}

function buildGraph() {
    listFiles(SRC_DIR);
    for (const f of files) {
        const imps = readImports(f).map((spec) => resolveImport(f, spec)).filter(Boolean);
        importsMap.set(f, new Set(imps));
    }
}

function findReachable() {
    const roots = [...files].filter((f) => ENTRY_FILES.has(path.relative(SRC_DIR, f)));
    // If no explicit entries found, use main.tsx if present
    const altMain = path.join(SRC_DIR, 'main.tsx');
    if (roots.length === 0 && files.has(altMain)) roots.push(altMain);

    const visited = new Set();
    const stack = [...roots];
    while (stack.length) {
        const cur = stack.pop();
        if (visited.has(cur)) continue;
        visited.add(cur);
        const next = importsMap.get(cur) || new Set();
        for (const n of next) {
            if (!visited.has(n)) stack.push(n);
        }
    }
    return visited;
}

function main() {
    buildGraph();
    const reachable = findReachable();
    const orphans = [...files].filter((f) => !reachable.has(f));
    console.log('Total files:', files.size);
    console.log('Reachable:', reachable.size);
    console.log('Orphans:', orphans.length);
    for (const o of orphans) {
        console.log(path.relative(SRC_DIR, o));
    }
    if (orphans.length) {
        console.log('\nReview these orphans before deletion. Consider assets separately.');
    }
}

main();