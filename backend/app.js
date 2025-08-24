require('dotenv').config();
const express = require('express');
const uploadsRouter = require('./src/routes/uploads');
const listRouter = require('./src/routes/list');
const imagesRouter  = require('./src/routes/images');
const listFromMongo = require('./src/routes/listFromMongo');


const app = express();
app.use(express.json());

// CORS (ajusta origins según tu frontend)
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://tu-dominio.com'],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/uploads', uploadsRouter);
app.use('/api/list', listRouter);
app.use('/api/images', imagesRouter);
app.use('/api/list-mongo', listFromMongo);


const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API escuchando en http://localhost:${port}`));
