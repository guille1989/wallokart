// ruta para hacer get de un modelo en mongo
const express = require('express');
const router = express.Router();
const Images = require('../models/Image');
const Projects = require('../models/Proyecto');
const { connectDB } = require('../db');

// GET todas las imágenes
router.get('/', async (req, res) => {
	try {
		await connectDB();
		const images = await Images.find();
		res.json(images);
	} catch (err) {
		res.status(500).json({ error: 'Error al obtener imágenes', details: err.message });
	}
});

router.get('/proyectos', async (req, res) => {
	try {
		await connectDB();
		const proyectos = await Projects.find();
		res.json(proyectos);
	} catch (err) {
		res.status(500).json({ error: 'Error al obtener proyectos', details: err.message });
	}
});

module.exports = router;
