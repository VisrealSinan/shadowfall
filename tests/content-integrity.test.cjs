const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = path.resolve(__dirname, '..');
test('every launcher content file has the advertised size and SHA-256', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'version.json')));
  const seen = new Set();
  for (const file of manifest.files) {
    assert.ok(!seen.has(file.name), 'duplicate ' + file.name);
    seen.add(file.name);
    const data = fs.readFileSync(path.join(root, file.name));
    if (/\.(js|html|json|css|svg|txt|webmanifest)$/.test(file.name)) assert.ok(!data.includes(13), file.name + ' must use LF to match GitHub hosting');
    assert.equal(data.length, file.size, file.name + ' size');
    assert.equal(crypto.createHash('sha256').update(data).digest('hex'), file.sha256, file.name + ' hash');
  }
  assert.ok(fs.readFileSync(path.join(root, 'sw.js'), 'utf8').includes('shadowfall-v' + manifest.version));
});
