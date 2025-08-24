const { mongoose } = require('../db');
const Counter = require('./Counter');

const ImageSchema = new mongoose.Schema({
  id:        { type: Number, unique: true, index: true }, // autoincremental
  title:     { type: String, required: true, trim: true },
  category:  [{ type: String, required: true, trim: true }], // ej: ["concept-art", "digital-art"]
  image:     { type: String, required: true },             // URL pública (CDN/S3)
  s3Key:     { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  mime:      { type: String },
  size:      { type: Number },
  createdAt: { type: Date, default: Date.now }
});

// Índices útiles
ImageSchema.index({ category: 1, createdAt: -1 });
ImageSchema.index({ title: 'text', description: 'text' });

// asigna id autoincremental si no viene
ImageSchema.pre('save', async function(next) {
  if (this.isNew && (this.id === undefined || this.id === null)) {
    const c = await Counter.findByIdAndUpdate(
      { _id: 'images' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.id = c.seq;
  }
  next();
});

module.exports = mongoose.model('Image', ImageSchema);
