export function buildPublicUrl(key) {
  const cdn = process.env.REACT_APP_CDN_DOMAIN;
  if (cdn) return `https://${cdn}/${key}`;
  // Fallback SOLO para prototipos con S3 público
  const region = process.env.REACT_APP_AWS_REGION || 'eu-west-1';
  const bucket = process.env.REACT_APP_S3_BUCKET || 'TU_BUCKET_PUBLICO';
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}
