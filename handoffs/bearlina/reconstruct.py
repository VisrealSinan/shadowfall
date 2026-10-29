from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parent
meta=json.loads((root/'manifest.json').read_text())
parts=[]
for item in meta['parts']:
    data=(root/item['name']).read_bytes()
    if len(data)!=item['bytes'] or hashlib.sha256(data).hexdigest()!=item['sha256']:
        raise SystemExit('Invalid or incomplete part: '+item['name'])
    parts.append(data)
data=b''.join(parts)
if len(data)!=meta['bytes'] or hashlib.sha256(data).hexdigest()!=meta['sha256']:
    raise SystemExit('Archive integrity check failed')
output=root/meta['filename']
output.write_bytes(data)
print('Verified package ready: '+str(output))
