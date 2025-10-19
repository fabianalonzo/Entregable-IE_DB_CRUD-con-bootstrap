const nodemon = require("nodemon");
const db = require("../config/db");

// Crear curso
exports.crearCurso = async (req, res) => {
  // Orden según tabla: id_curso (auto), titulo, id_subcat, fecha_inicio, fecha_fin, duracion_horas, id_docente, precio
  const {
    titulo,
    id_subcat,
    fecha_inicio,
    fecha_fin,
    duracion_horas,
    id_docente,
    precio,
  } = req.body;

  if (
    !titulo ||
    !id_subcat ||
    !fecha_inicio ||
    !fecha_fin ||
    !duracion_horas ||
    !id_docente ||
    !precio
  ) {
    return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
  }

  try {
    // Validar subcategoría y docente
    const [subcat] = await db.query(
      "SELECT id_subcat FROM subCategoria WHERE id_subcat = ?",
      [id_subcat]
    );
    if (subcat.length === 0) {
      return res.status(400).json({ mensaje: "La subcategoría no existe" });
    }

    const [docente] = await db.query(
      "SELECT id_docente FROM docente WHERE id_docente = ?",
      [id_docente]
    );
    if (docente.length === 0) {
      return res.status(400).json({ mensaje: "El docente no existe" });
    }

    const sql = `
      INSERT INTO curso (titulo, id_subcat, fecha_inicio, fecha_fin, duracion_horas, id_docente, precio)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [
      // Orden igual que en tabla
      titulo, // titulo
      id_subcat, // id_subcat
      fecha_inicio, // fecha_inicio
      fecha_fin, // fecha_fin
      duracion_horas, // duracion_horas
      id_docente, // id_docente
      precio, // precio
    ]);

    res
      .status(201)
      .json({ id: result.insertId, mensaje: "Curso creado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Listar cursos
exports.obtenerCursos = async (req, res) => {
  const sql = `
    SELECT c.id_curso, 
           c.titulo,
           s.nombre AS subcategoria,
           DATE_FORMAT(c.fecha_inicio, '%Y-%m-%d') AS fecha_inicio,
           DATE_FORMAT(c.fecha_fin, '%Y-%m-%d') AS fecha_fin,
           c.duracion_horas, 
           d.nombre AS docente,
           c.precio 
    FROM curso c
    JOIN subCategoria s ON c.id_subcat = s.id_subcat
    JOIN docente d ON c.id_docente = d.id_docente
  `;

  try {
    const [cursos] = await db.query(sql);
    res.status(200).json(cursos);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno al obtener los cursos" });
  }
};

// Obtener por ID
exports.obtenerCursoPorId = async (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT id_curso, titulo, id_subcat, fecha_inicio, fecha_fin, duracion_horas, id_docente, precio
    FROM curso WHERE id_curso = ?
  `;

  try {
    const [rows] = await db.query(sql, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    res.status(200).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// Actualizar curso
exports.actualizarCurso = async (req, res) => {
  const { id } = req.params;
  // Orden campos para actualizar igual que en tabla
  const {
    titulo,
    id_subcat,
    fecha_inicio,
    fecha_fin,
    duracion_horas,
    id_docente,
    precio,
  } = req.body;

  if (
    !titulo &&
    !id_subcat &&
    !fecha_inicio &&
    !fecha_fin &&
    !duracion_horas &&
    !id_docente &&
    !precio
  ) {
    return res.status(400).json({ mensaje: "No hay datos para actualizar" });
  }

  try {
    let campos = [];
    let valores = [];

    if (titulo) {
      campos.push("titulo = ?");
      valores.push(titulo);
    }

    if (id_subcat) {
      const [subcat] = await db.query(
        "SELECT id_subcat FROM subCategoria WHERE id_subcat = ?",
        [id_subcat]
      );
      if (subcat.length === 0)
        return res.status(400).json({ mensaje: "Subcategoría no válida" });
      campos.push("id_subcat = ?");
      valores.push(id_subcat);
    }

    if (fecha_inicio) {
      campos.push("fecha_inicio = ?");
      valores.push(fecha_inicio);
    }

    if (fecha_fin) {
      campos.push("fecha_fin = ?");
      valores.push(fecha_fin);
    }

    if (duracion_horas) {
      campos.push("duracion_horas = ?");
      valores.push(duracion_horas);
    }

    if (id_docente) {
      const [docente] = await db.query(
        "SELECT id_docente FROM docente WHERE id_docente = ?",
        [id_docente]
      );
      if (docente.length === 0)
        return res.status(400).json({ mensaje: "Docente no válido" });
      campos.push("id_docente = ?");
      valores.push(id_docente);
    }

    if (precio) {
      campos.push("precio = ?");
      valores.push(precio);
    }

    valores.push(id);
    const sql = `UPDATE curso SET ${campos.join(", ")} WHERE id_curso = ?`;

    const [result] = await db.query(sql, valores);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    res.status(200).json({ mensaje: "Curso actualizado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno" });
  }
};

// Eliminar curso
exports.eliminarCurso = async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM curso WHERE id_curso = ?";

  try {
    const [result] = await db.query(sql, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    res.status(200).json({ mensaje: "Curso eliminado correctamente" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: "Error interno" });
  }
};
