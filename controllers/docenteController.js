//Acceso a la bd
const nodemon = require("nodemon");
const db = require("../config/db");

//Crear
exports.crearDocente = async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ mensaje: "Falta completar el campo nombre" });
  }

  try {
    const sql = "INSERT INTO docente (nombre) VALUES (?)";
    const [result] = await db.query(sql, [nombre]);

    res.status(201).json({
      id: result.insertId,
      mensaje: "Docente registrado correctamente"
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Listar
exports.obtenerDocentes = async (req, res) => {
  const sql = "SELECT id_docente AS id, nombre FROM docente";

  try {
    const [docentes] = await db.query(sql);
    res.status(200).json({ docentes });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Buscar por ID
exports.obtenerDocentePorId = async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT id_docente AS id, nombre FROM docente WHERE id_docente = ?";

  try {
    const [docentes] = await db.query(sql, [id]);

    if (docentes.length === 0) {
      return res.status(404).json({ mensaje: "No se encontró el docente" });
    }

    res.status(200).json(docentes[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Actualizar
exports.actualizarDocente = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ mensaje: "Falta completar el campo nombre" });
  }

  const sql = "UPDATE docente SET nombre = ? WHERE id_docente = ?";

  try {
    const [result] = await db.query(sql, [nombre, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "No se encontró el docente con el ID" });
    }

    res.status(200).json({ mensaje: "Docente actualizado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

//Eliminar
exports.eliminarDocente = async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM docente WHERE id_docente = ?";

  try {
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Docente no encontrado para eliminar" });
    }

    res.status(200).json({ mensaje: "Docente eliminado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};
