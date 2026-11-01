/* Install this verified source build through the existing launcher's content cache. */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const source = path.resolve(__dirname, '..');
const install = path.resolve(source, '..');
const userData = path.join(process.env.APPDATA, 'Shadowfall');
const asar = path.join(install, 'resources', 'app.asar');
const fd = fs.openSync(asar, 'r'), prefix = Buffer.alloc(16);
fs.readSync(fd, prefix, 0, 16, 0);
const header = Buffer.alloc(prefix.readUInt32LE(12));
fs.readSync(fd, header, 0, header.length, 16);
const tree = JSON.parse(header.toString()), base = 8 + prefix.readUInt32LE(4);
function packaged(name) {
  let entry = tree;
  for (const part of name.split('/')) entry = entry.files[part];
  const data = Buffer.alloc(entry.size);
  fs.readSync(fd, data, 0, data.length, base + Number(entry.offset));
  return data;
}
const mod = { exports: {} };
new Function('require', 'module', 'exports', packaged('content-updater.js').toString())(require, mod, mod.exports);
const { ContentManager, validateManifest, verifyDir, cmpVer } = mod.exports;
const manifest = validateManifest(JSON.parse(fs.readFileSync(path.join(source, 'version.json'))));
if (!verifyDir(source, manifest)) throw new Error('Source manifest verification failed');
for (const file of manifest.files) if (fs.statSync(path.join(source, file.name)).size !== file.size) throw new Error('Size mismatch: ' + file.name);
const bundled = JSON.parse(packaged('game/version.json'));
fs.closeSync(fd);
const root = path.join(userData, 'game-content'), pointer = path.join(root, 'current.json');
fs.mkdirSync(root, { recursive: true });
const oldPointer = fs.existsSync(pointer) ? fs.readFileSync(pointer) : null;
if (oldPointer && cmpVer(JSON.parse(oldPointer).version, manifest.version) > 0) throw new Error('Refusing to downgrade newer installed content');
const finalName = 'v' + manifest.version, final = path.join(root, finalName);
if (fs.existsSync(final)) {
  if (!verifyDir(final, manifest)) throw new Error('Existing target differs; leave it intact for investigation');
} else {
  const stage = path.join(root, '.staging-local-' + manifest.version + '-' + crypto.randomBytes(4).toString('hex'));
  fs.mkdirSync(stage);
  for (const file of manifest.files) {
    const dest = path.join(stage, file.name);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(source, file.name), dest);
  }
  fs.writeFileSync(path.join(stage, 'version.json'), JSON.stringify(manifest, null, 1));
  if (!verifyDir(stage, manifest)) throw new Error('Staged content verification failed; installed version untouched');
  fs.renameSync(stage, final);
}
const backup = path.join(install, 'update-backups', new Date().toISOString().replace(/[:.]/g, '-'));
fs.mkdirSync(backup, { recursive: true });
if (oldPointer) fs.writeFileSync(path.join(backup, 'current-before.json'), oldPointer);
const bundledDir = path.join(backup, 'bundled-info');
fs.mkdirSync(bundledDir);
fs.writeFileSync(path.join(bundledDir, 'version.json'), JSON.stringify(bundled));
const temporary = pointer + '.tmp-local-' + process.pid;
fs.writeFileSync(temporary, JSON.stringify({ version: manifest.version, dir: finalName, installed: new Date().toISOString() }, null, 1));
fs.renameSync(temporary, pointer);
const manager = new ContentManager({ userData, bundledDir, launcherVersion: '2.0.2', url: 'https://visrealsinan.github.io/shadowfall/version.json', fetch: () => { throw new Error('No network during local installation'); } });
const active = manager.active();
if (active.version !== manifest.version || active.source !== 'cache') {
  if (oldPointer) fs.writeFileSync(pointer, oldPointer);
  throw new Error('Launcher did not select the new content; old pointer restored');
}
console.log(JSON.stringify({ installedVersion: active.version, verifiedFiles: manifest.files.length, activeDirectory: active.dir, pointerBackup: path.join(backup, 'current-before.json'), savesPreserved: true }, null, 2));
