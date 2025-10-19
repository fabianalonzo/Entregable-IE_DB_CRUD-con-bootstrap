// Acceso a la BD
const nodemon = require("nodemon");
const db = require("../config/db");

// Crear categoría
exports.crearCategoria = async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ mensaje: "Falta completar el campo nombre" });
  }

  try {
    const sql = "INSERT INTO categoria (nombre) VALUES (?)";
    const [result] = await db.query(sql, [nombre]);

    res.status(201).json({
      id: result.insertId,
      mensaje: "Categoría registrada correctamente"
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Listar todas las categorías
exports.obtenerCategorias = async (req, res) => {
  const sql = "SELECT id_categoria, nombre FROM categoria";

  try {
    const [categorias] = await db.query(sql);
    res.status(200).json(categorias);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Obtener categoría por ID
exports.obtenerCategoriaPorId = async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT id_categoria, nombre FROM categoria WHERE id_categoria = ?";

  try {
    const [categorias] = await db.query(sql, [id]);

    if (categorias.length === 0) {
      return res.status(404).json({ mensaje: "No se encontró la categoría" });
    }

    res.status(200).json(categorias[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Actualizar categoría
exports.actualizarCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ mensaje: "Falta completar el campo nombre" });
  }

  const sql = "UPDATE categoria SET nombre = ? WHERE id_categoria = ?";

  try {
    const [result] = await db.query(sql, [nombre, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "No se encontró la categoría con ese ID" });
    }

    res.status(200).json({ mensaje: "Categoría actualizada correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Eliminar categoría
exports.eliminarCategoria = async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM categoria WHERE id_categoria = ?";

  try {
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Categoría no encontrada para eliminar" });
    }

    res.status(200).json({ mensaje: "Categoría eliminada correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
