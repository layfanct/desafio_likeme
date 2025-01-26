import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

// Configuración de la base de datos
const pool = new Pool({
  user: "postgres", 
  host: "localhost",
  database: "likeme",
  password: "123123123", 
  port: 5432,
});

// Inicialización del servidor
const app = express();
app.use(cors());
app.use(express.json());

// Ruta GET: Obtener todos los posts
app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener los posts:", error);
    res.status(500).json({ error: "Error al obtener los posts" });
  }
});

// Ruta POST: Agregar un nuevo post
app.post("/posts", async (req, res) => {
  const { titulo, url, descripcion } = req.body;
  try {
    await pool.query(
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4)",
      [titulo, url, descripcion, 0]
    );
    res.status(201).json({ message: "Post agregado con éxito" });
  } catch (error) {
    console.error("Error al agregar el post:", error);
    res.status(500).json({ error: "Error al agregar el post" });
  }
});

// Configuración del puerto
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
