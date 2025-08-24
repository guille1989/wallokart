const { mongoose } = require('../db');

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },   // nombre de secuencia (p.ej. "images")
  seq: { type: Number, default: 0 }
});

module.exports = mongoose.model('Counter', CounterSchema);
