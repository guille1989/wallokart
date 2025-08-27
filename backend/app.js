require("dotenv").config();
const express = require("express");
const uploadsRouter = require("./src/routes/uploads");
const listRouter = require("./src/routes/list");
const listProyectosRouter = require("./src/routes/listProjects");
const imagesRouter = require("./src/routes/images");
const proyectosRouter = require("./src/routes/proyectos");
const listFromMongoRouter = require("./src/routes/listFromMongo");
const uploadsProjectsRouter = require("./src/routes/uploadsProjects");

const app = express();
app.use(express.json());

// CORS (ajusta origins según tu frontend)
const cors = require("cors");
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://wallokart-gjcc.vercel.app",
      "https://wallokart.vercel.app",
      "https://wallokart.s3.us-east-1.amazonaws.com",
    ],
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["*"],
  })
);

app.use("/api/uploads", uploadsRouter);
app.use("/api/list", listRouter);
app.use("/api/list-proyectos", listProyectosRouter);
app.use("/api/images", imagesRouter);
app.use("/api/proyectos", proyectosRouter);
app.use("/api/list-mongo", listFromMongoRouter);
app.use("/api/uploads-proyectos", uploadsProjectsRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API escuchando por puerto:${port}`));
