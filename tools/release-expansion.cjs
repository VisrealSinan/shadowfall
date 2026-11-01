const fs = require('fs');
const crypto = require('crypto');
const version = JSON.parse(fs.readFileSync('version.json', 'utf8'));
const next = process.argv[2];
if (!/^\d+$/.test(next || '')) throw new Error('Pass a numeric version');
version.version = next;
version.date = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
if (process.argv.length > 3) version.notes = process.argv.slice(3);
// Write the service worker before hashing it into the launcher's manifest.
const sw = fs.readFileSync('sw.js', 'utf8').replace(/shadowfall-v\d+/, 'shadowfall-v' + next);
fs.writeFileSync('sw.js', sw);
for (const name of ['index.html', 'sw.js', 'assets/expansion-content.js', 'assets/expansion-rules.js', 'assets/expansion-ui.js', 'assets/actor-animations.js']) {
  const data = fs.readFileSync(name);
  const entry = { name, sha256: crypto.createHash('sha256').update(data).digest('hex'), size: data.length };
  const index = version.files.findIndex(file => file.name === name);
  if (index < 0) version.files.push(entry); else version.files[index] = entry;
}
fs.writeFileSync('version.json', JSON.stringify(version, null, 1) + '\n');
