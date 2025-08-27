const { Router } = require("express");
const { randomUUID } = require("crypto");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3, BUCKET } = require("../aws");

const router = Router();

// Opcional: valida tipos y tamaños permitidos
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);
const MAX_MB = 10; // límite recomendado; real se controla en cliente o con políticas S3

router.post("/presign", async (req, res) => {
  try {
    const { fileName, contentType, folder = "proyectos" } = req.body || {};
    if (!fileName || !contentType) {
      return res
        .status(400)
        .json({ error: "fileName y contentType son requeridos" });
    }
    if (!ALLOWED_MIME.has(contentType)) {
      return res.status(400).json({ error: "Tipo de archivo no permitido" });
    }

    // Deriva extensión del nombre original
    const ext =
      (fileName.split(".").pop() || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "") || "bin";
    const datePrefix = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const key = `${folder}/${datePrefix}/${randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType

      // Si vas a servir directo desde S3 (no recomendado en prod):
      // ACL: 'public-read',
      // Puedes agregar metadata si quieres:
      // Metadata: { app: 'proyectos' }
      // No puedes imponer tamaño aquí; contrólalo en cliente y/o valida al recibir.
    });

    // URL firmada válida 5 min (300s)
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    res.json({ uploadUrl, key });
  } catch (err) {
    console.error("[presign] error:", err);
    res.status(500).json({ error: "No se pudo firmar la URL" });
  }
});

module.exports = router;
