const { Router } = require("express");
const {
  ListObjectsV2Command,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3, BUCKET, CLOUDFRONT_DOMAIN } = require("../aws");

const router = Router();

// (Opcional) Limita qué prefijos se pueden listar
const ALLOWED_PREFIXES = ["proyecto/"]; // ajusta o deja [] para permitir todos

router.get("/", async (req, res) => {
  try {
    let {
      prefix = "proyecto/", // "carpeta" a listar: p.ej. "proyecto/2025-08-21/"
      maxKeys = "50", // 1..1000
      token, // paginación: NextContinuationToken
      delimiter = "", // usa "/" para agrupar subcarpetas
      signed = "false", // "true" => devuelve URLs firmadas de GET
    } = req.query;

    // Seguridad simple por prefijo
    if (
      ALLOWED_PREFIXES.length &&
      !ALLOWED_PREFIXES.some((p) => prefix.startsWith(p))
    ) {
      return res.status(400).json({ error: "Prefix no permitido" });
    }

    maxKeys = Math.min(Math.max(parseInt(maxKeys, 10) || 50, 1), 1000);
    delimiter = delimiter === "/" ? "/" : undefined;
    const useSigned = String(signed).toLowerCase() === "true";

    const cmd = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
      MaxKeys: maxKeys,
      ContinuationToken: token,
      Delimiter: delimiter,
    });

    const out = await s3.send(cmd);

    const contents = (out.Contents || []).filter(
      (obj) => obj.Key && !obj.Key.endsWith("/")
    );

    // Construye URL pública (CloudFront > S3) o firmada
    const items = await Promise.all(
      contents.map(async (obj) => {
        let url;
        if (useSigned) {
          url = await getSignedUrl(
            s3,
            new GetObjectCommand({ Bucket: BUCKET, Key: obj.Key }),
            { expiresIn: 300 } // 5 min
          );
        } else if (CLOUDFRONT_DOMAIN) {
          url = `https://${CLOUDFRONT_DOMAIN}/${encodeURI(obj.Key)}`;
        } else {
          url = `https://${BUCKET}.s3.${
            process.env.AWS_REGION
          }.amazonaws.com/${encodeURI(obj.Key)}`;
        }
        return {
          key: obj.Key,
          size: obj.Size,
          etag: obj.ETag,
          lastModified: obj.LastModified,
          url,
        };
      })
    );

    res.json({
      bucket: BUCKET,
      region: process.env.AWS_REGION,
      prefix,
      isTruncated: !!out.IsTruncated,
      nextToken: out.NextContinuationToken || null,
      // Si pasas delimiter="/" recibes "subcarpetas" aquí:
      folders: (out.CommonPrefixes || []).map((p) => p.Prefix),
      items,
    });
  } catch (e) {
    if (e?.$metadata?.httpStatusCode === 403 || e?.Code === "AccessDenied") {
      return res
        .status(403)
        .json({
          error: "AccessDenied: falta permiso S3 (ListBucket/GetObject)",
        });
    }
    console.error("[list] error", e);
    res
      .status(500)
      .json({ error: "No se pudo listar objetos", details: e.message });
  }
});

module.exports = router;
