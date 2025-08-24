const API_BASE = process.env.REACT_APP_API_BASE || '';

export async function presignUpload({ fileName, contentType, folder = 'catalogo' }) {
  const res = await fetch(`${API_BASE}/api/uploads/presign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, contentType, folder })
  });
  if (!res.ok) {
    let msg = 'No se pudo obtener URL firmada';
    try { const j = await res.json(); if (j?.error) msg = j.error; } catch {}
    throw new Error(msg);
  }
  return res.json(); // { uploadUrl, key }
}
