const { mongoose } = require("../db");
const Counter = require("./Counter");

const ProyectoSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true }, // autoincremental
  title: { type: String, required: true, trim: true },
  client: { type: String, required: true, trim: true },
  annio: {
    type: Number,
    required: true,
    min: 2000,
    max: new Date().getFullYear(),
  },
  category: [{ type: String, required: true, trim: true }], // ej: ["concept-art", "digital-art"]
  technologies: [{ type: String, required: true, trim: true }],
  image: { type: String, required: true }, // URL pública (CDN/S3)
  s3Key: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  mime: { type: String },
  size: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

// Índices útiles
ProyectoSchema.index({ category: 1, createdAt: -1 });
ProyectoSchema.index({ title: "text", description: "text" });

// asigna id autoincremental si no viene
ProyectoSchema.pre("save", async function (next) {
  if (this.isNew && (this.id === undefined || this.id === null)) {
    const c = await Counter.findByIdAndUpdate(
      { _id: "proyectos" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.id = c.seq;
  }
  next();
});

module.exports = mongoose.model("Proyecto", ProyectoSchema);
