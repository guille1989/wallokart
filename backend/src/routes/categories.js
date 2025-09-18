const { Router } = require("express");
const router = Router();

const Category = require("../models/Category");

// Crear una nueva categoría
router.post("/", async (req, res) => {
    console.log("POST /api/categories body=", req.body);
  try {
    const { value, label } = req.body;
    if (!value || !label) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    // Normalizar value a minúsculas y sin espacios
    const cleanValue = value.trim().toLowerCase().replace(/\s+/g, "-");
    const cleanLabel = label.trim();
    // Verificar si ya existe
    const exists = await Category.findOne({ value: cleanValue });
    if (exists) {
      return res.status(409).json({ error: "La categoría ya existe" });
    }
    const cat = new Category({ value: cleanValue, label: cleanLabel });
    await cat.save();
    res.status(201).json(cat);
  } catch (e) {
    res.status(500).json({ error: "No se pudo crear la categoría" });
  }
});

// Eliminar una categoría por value
router.delete('/:value', async (req, res) => {
  try {
    const { value } = req.params;
    const deleted = await Category.findOneAndDelete({ value });
    if (!deleted) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'No se pudo eliminar la categoría' });
  }
});

// Devuelve todas las categorías desde la colección Category
router.get("/", async (req, res) => {
  try {
    const categorias = await Category.find({}, { _id: 0, value: 1, label: 1 });
    res.json(categorias);
  } catch (e) {
    res.status(500).json({ error: "No se pudieron obtener las categorías" });
  }
});

module.exports = router;
