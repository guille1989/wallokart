import React, { useState, useRef } from 'react';
import { presignUpload } from '../lib/api';
import { buildPublicUrl } from '../lib/cdn';

const ALLOWED = new Set(['image/jpeg','image/png','image/webp','image/avif','image/gif']);
const MAX_MB = Number(process.env.REACT_APP_MAX_MB || 10);

export default function Uploader({ multiple = true, onUploaded }) {
  const [items, setItems] = useState([]); // [{name, progress, url, error}]
  const inputRef = useRef(null);

  const pickFiles = () => inputRef.current?.click();

  async function handleFiles(files) {
    const arr = Array.from(files);
    for (const file of arr) {
      const row = { name: file.name, progress: 0, url: '', error: '' };
      setItems(prev => [...prev, row]);

      if (!ALLOWED.has(file.type)) {
        row.error = 'Tipo no permitido';
        setItems(prev => [...prev]);
        continue;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        row.error = `Archivo > ${MAX_MB} MB`;
        setItems(prev => [...prev]);
        continue;
      }

      try {
        const { uploadUrl, key } = await presignUpload({
          fileName: file.name, contentType: file.type, folder: 'catalogo'
        });

        await putWithProgress(uploadUrl, file, p => {
          row.progress = p; setItems(prev => [...prev]);
        });

        row.url = buildPublicUrl(key);
        row.progress = 100;
        setItems(prev => [...prev]);
        onUploaded?.({ key, url: row.url, name: file.name, type: file.type, size: file.size });
      } catch (err) {
        row.error = err.message || 'Error al subir';
        setItems(prev => [...prev]);
      }
    }
  }

  function onInputChange(e) {
    if (e.target.files?.length) handleFiles(e.target.files);
    e.target.value = ''; // permite re-seleccionar el mismo archivo
  }
  function onDrop(e) {
    e.preventDefault();
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={onInputChange}
      />
      <div
        onClick={pickFiles}
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
        style={{ border: '2px dashed #ccc', padding: 20, borderRadius: 12, cursor: 'pointer', textAlign: 'center' }}
      >
        <p><strong>Arrastra imágenes</strong> o haz click para seleccionar</p>
        <small>Permitidos: JPG, PNG, WebP, AVIF, GIF • Máx {MAX_MB}MB</small>
      </div>

      <ul style={{ marginTop: 16, listStyle: 'none', padding: 0 }}>
        {items.map((it, idx) => (
          <li key={idx} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {it.url
                ? <img src={it.url} alt={it.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} loading="lazy" />
                : <div style={{ width: 64, height: 64, background: '#eee', borderRadius: 8 }} />
              }
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{it.name}</span>
                  {it.error ? <span style={{ color: 'crimson' }}>{it.error}</span> : <span>{Math.round(it.progress)}%</span>}
                </div>
                <div style={{ background: '#f0f0f0', height: 8, borderRadius: 6, marginTop: 6 }}>
                  <div style={{
                    width: `${it.progress}%`, height: 8, borderRadius: 6,
                    background: it.error ? 'crimson' : '#4caf50', transition: 'width .2s'
                  }} />
                </div>
                {it.url && <a href={it.url} target="_blank" rel="noreferrer">Ver</a>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function putWithProgress(url, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.((e.loaded / e.total) * 100);
    };
    xhr.onerror = () => reject(new Error('Error de red al subir'));
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300) ? resolve() : reject(new Error(`S3 respondió ${xhr.status}`));
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
}
