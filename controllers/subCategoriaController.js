const nodemon = require("nodemon");
const db = require("../config/db");

// Crear subcategoría
exports.crearSubCategoria = async (req, res) => {
  const { nombre, id_categoria } = req.body;

  if (!nombre || !id_categoria) {
    return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
  }

  try {
    // Validar que la categoría exista
    const [categoria] = await db.query("SELECT id_categoria FROM categoria WHERE id_categoria = ?", [id_categoria]);
    if (categoria.length === 0) {
      return res.status(400).json({ mensaje: "La categoría no existe" });
    }

    const sql = "INSERT INTO subCategoria (nombre, id_categoria) VALUES (?, ?)";
    const [result] = await db.query(sql, [nombre, id_categoria]);

    res.status(201).json({ id: result.insertId, mensaje: "Subcategoría creada correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Listar subcategorías
exports.obtenerSubCategorias = async (req, res) => {
  const sql = `SELECT s.id_subcat AS id, s.nombre, s.id_categoria, c.nombre AS categoria
               FROM subCategoria s
               JOIN categoria c ON s.id_categoria = c.id_categoria`;

  try {
    const [subcategorias] = await db.query(sql);
    res.status(200).json({ subcategorias });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error al obtener subcategorías" });
  }
};

// Obtener por ID
exports.obtenerSubCategoriaPorId = async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT id_subcat AS id, nombre, id_categoria FROM subCategoria WHERE id_subcat = ?";

  try {
    const [rows] = await db.query(sql, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Subcategoría no encontrada" });
    }

    res.status(200).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// Actualizar
exports.actualizarSubCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre, id_categoria } = req.body;

  if (!nombre && !id_categoria) {
    return res.status(400).json({ mensaje: "No hay datos para actualizar" });
  }

  try {
    let sqlParts = [];
    let values = [];

    if (nombre) {
      sqlParts.push("nombre = ?");
      values.push(nombre);
    }

    if (id_categoria) {
      const [categoria] = await db.query("SELECT id_categoria FROM categoria WHERE id_categoria = ?", [id_categoria]);
      if (categoria.length === 0) {
        return res.status(400).json({ mensaje: "Categoría no válida" });
      }
      sqlParts.push("id_categoria = ?");
      values.push(id_categoria);
    }

    values.push(id);
    const sql = `UPDATE subCategoria SET ${sqlParts.join(", ")} WHERE id_subcat = ?`;

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Subcategoría no encontrada" });
    }

    res.status(200).json({ mensaje: "Subcategoría actualizada correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// Eliminar
exports.eliminarSubCategoria = async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM subCategoria WHERE id_subcat = ?";

  try {
    const [result] = await db.query(sql, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Subcategoría no encontrada" });
    }

    res.status(200).json({ mensaje: "Subcategoría eliminada correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno" });
  }
};
