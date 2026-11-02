const fs = require('fs');
const crypto = require('crypto');
const version = JSON.parse(fs.readFileSync('version.json', 'utf8'));
const next = process.argv[2];
if (!/^\d+$/.test(next || '')) throw new Error('Pass a numeric version');
version.version = next;
version.date = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
if (process.argv.length > 3) version.notes = process.argv.slice(3);
fs.writeFileSync('sw.js', fs.readFileSync('sw.js', 'utf8').replace(/shadowfall-v\d+/, 'shadowfall-v' + next));
const names = new Set([...version.files.map(file => file.name), 'index.html', 'sw.js', 'assets/expansion-content.js', 'assets/expansion-rules.js', 'assets/expansion-ui.js', 'assets/actor-animations.js', 'assets/actor-outfits.js', 'assets/nightforge.js', 'assets/nightforge-ui.js', 'assets/achievement-hall.js', 'assets/achievement-hall.css', 'assets/run-prep.js', 'assets/race-talents.js', 'assets/journey-scenes.js', 'assets/journey-scenes.css', 'assets/selection-scenes.js', 'assets/selection-scenes.css', 'assets/settings.css', 'assets/field-ui.js', 'assets/field-ui.css']);
names.add('assets/art-v85-manifest.js');
names.add('assets/rebirth-rules.js');
names.add('assets/rebirth-art.js');
names.add('assets/rebirth-content.js');
names.add('assets/rebirth-scenes.js');
names.add('assets/rebirth.css');
names.add('assets/graveshade-races.png');
names.add('assets/paired-survivor-races.png');
names.add('assets/druid-form-races.png');
names.add('assets/vendors-modern.png');
names.add('assets/summons-modern.png');
names.add('assets/map-vistas-modern.png');
names.add('assets/world-materials-modern.png');
names.add('assets/world-props-modern.png');
for(const name of ['motion-rig.js','motion86-manifest.js','motion-completion.js',...fs.readdirSync('assets').filter(n=>/^motion86-.*\.png$/.test(n))])names.add('assets/'+name);
for(const name of ['art-v87-manifest.js','skill-art.js','polish87.js','polish87.css',...fs.readdirSync('assets').filter(n=>/-v87\.png$/.test(n))])names.add('assets/'+name);
for (const name of names) {
  // GitHub normalizes text to LF. Verify and publish those identical bytes locally.
  if (/\.(js|html|json|css|svg|txt|webmanifest)$/.test(name)) {
    const text = fs.readFileSync(name, 'utf8');
    if (text.includes('\r')) fs.writeFileSync(name, text.replace(/\r\n?/g, '\n'));
  }
  const data = fs.readFileSync(name);
  const entry = { name, sha256: crypto.createHash('sha256').update(data).digest('hex'), size: data.length };
  const index = version.files.findIndex(file => file.name === name);
  if (index < 0) version.files.push(entry); else version.files[index] = entry;
}
fs.writeFileSync('version.json', JSON.stringify(version, null, 1) + '\n');
