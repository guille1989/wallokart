const { Router } = require('express');
const { connectDB } = require('../db');
const Proyecto = require('../models/Proyecto');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const router = Router();

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET = process.env.AWS_S3_BUCKET;

// Utilidad para construir URL pública
function publicUrlForKey(key) {
  if (process.env.CLOUDFRONT_DOMAIN) {
    return `https://${process.env.CLOUDFRONT_DOMAIN}/${encodeURI(key)}`;
  }
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURI(key)}`;
}

/**
 * POST /api/proyectos
 * body: { key, title, category, description?, mime?, size?, image? }
 */
router.post('/', async (req, res) => {
  try {
    await connectDB();
    const { key, title, category, description='', mime, size, image, annio, technologies, client } = req.body || {};
    if (!key || !title || !category || !annio || !client) {
      return res.status(400).json({ error: 'key, title, category, annio y client son requeridos' });
    }

    const doc = await Proyecto.create({
      title,
      category,
      technologies,
      s3Key: key,
      image: image || publicUrlForKey(key),
      description,
      mime,
      size,
      annio,
      client
    });

    res.json(doc);
  } catch (e) {
    console.error('[POST /Proyectos]', e);
    res.status(500).json({ error: 'No se pudo guardar', details: e.message });
  }
});

/**
 * GET /api/images?category=&q=&limit=20&page=1
 */
router.get('/images', async (req, res) => {
  try {
    await connectDB();
    const { category, q, limit='20', page='1' } = req.query;
    const lim = Math.min(Math.max(parseInt(limit,10)||20, 1), 100);
    const skip = (Math.max(parseInt(page,10)||1, 1) - 1) * lim;

    const filter = {};
    if (category) filter.category = category;
    if (q) filter.$text = { $search: q };

    const [items, total] = await Promise.all([
      Proyecto.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim).lean(),
      Proyecto.countDocuments(filter)
    ]);

    res.json({ items, total, page: Number(page), pages: Math.ceil(total/lim) });
  } catch (e) {
    console.error('[GET /proyectos]', e);
    res.status(500).json({ error: 'No se pudo listar', details: e.message });
  }
});

// DELETE /api/proyectos/by-key?key=catalogo/.../file.jpeg&invalidate=true
router.delete('/by-key', async (req, res) => {
  try {
    await connectDB();
    const { key } = req.query;
    const invalidate = String(req.query.invalidate || 'false').toLowerCase() === 'true';
    if (!key) return res.status(400).json({ error: 'key es requerido' });

    // 1) S3
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));

    // 2) Mongo
    const del = await Proyecto.deleteMany({ s3Key: key });

    // 3) (Opcional) Invalidar CloudFront
    if (invalidate && process.env.CLOUDFRONT_DISTRIBUTION_ID) {
      try {
        const { CloudFrontClient, CreateInvalidationCommand } = require('@aws-sdk/client-cloudfront');
        const cf = new CloudFrontClient({ region: process.env.AWS_REGION });
        await cf.send(new CreateInvalidationCommand({
          DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
          InvalidationBatch: {
            CallerReference: `${Date.now()}-${key}`,
            Paths: { Quantity: 1, Items: [`/${key}`] }
          }
        }));
      } catch (e) {
        console.warn('[CF invalidation] fallo no crítico:', e.message);
      }
    }

    res.json({ ok: true, deletedFromS3: true, deletedDocs: del.deletedCount || 0 });
  } catch (e) {
    console.error('[DELETE /proyectos/by-key]', e);
    if (e?.$metadata?.httpStatusCode === 403) {
      return res.status(403).json({ error: 'AccessDenied: falta permiso s3:DeleteObject' });
    }
    res.status(500).json({ error: 'No se pudo eliminar', details: e.message });
  }
});

module.exports = router;
