const API_URL_CURSO = 'http://localhost:3000/api/curso';
const API_URL_SUBCAT = 'http://localhost:3000/api/subcategoria';
const API_URL_DOCENTE = 'http://localhost:3000/api/docente';

const formulario = document.getElementById('form-curso');
const tabla = document.querySelector('#tabla-curso tbody');

const idcurso = document.getElementById('idcurso');
const titulo = document.getElementById('titulo');
const id_subcat = document.getElementById('id_subcat');
const fecha_inicio = document.getElementById('fecha_inicio');
const fecha_fin = document.getElementById('fecha_fin');
const duracion_horas = document.getElementById('duracion_horas');
const id_docente = document.getElementById('id_docente');
const precio = document.getElementById('precio');

const btnGuardar = document.getElementById('btnGuardar');
const btnCancelar = document.getElementById('btnCancelar');

// Resetear formulario
btnCancelar.addEventListener('click', () => {
  formulario.reset();
  idcurso.value = '';
  btnGuardar.textContent = 'Guardar';
});

// Cargar subcategorías
async function cargarSubcategorias() {
  try {
    const response = await fetch(API_URL_SUBCAT);
    const subcategorias = await response.json();

    id_subcat.innerHTML = '<option disabled selected value="">Seleccione una subcategoría</option>';
    subcategorias.forEach(subcat => {
      const option = document.createElement('option');
      option.value = subcat.id_subcat;
      option.textContent = subcat.nombre;
      id_subcat.appendChild(option);
    });
  } catch (e) {
    console.error('Error al cargar subcategorías', e);
  }
}

// Cargar docentes
async function cargarDocentes() {
  try {
    const response = await fetch(API_URL_DOCENTE);
    const docentes = await response.json();

    id_docente.innerHTML = '<option disabled selected value="">Seleccione un docente</option>';
    docentes.forEach(docente => {
      const option = document.createElement('option');
      option.value = docente.id_docente;
      option.textContent = docente.nombre;
      id_docente.appendChild(option);
    });
  } catch (e) {
    console.error('Error al cargar docentes', e);
  }
}

// Mostrar cursos en la tabla
async function obtenerCursos() {
  try {
    const response = await fetch(API_URL_CURSO);
    const cursos = await response.json();

    tabla.innerHTML = '';
    cursos.forEach(curso => {
      const row = tabla.insertRow();

      row.insertCell().textContent = curso.id_curso;
      row.insertCell().textContent = curso.titulo;
      row.insertCell().textContent = curso.subcategoria;
      row.insertCell().textContent = curso.fecha_inicio;
      row.insertCell().textContent = curso.fecha_fin;
      row.insertCell().textContent = curso.duracion_horas;
      row.insertCell().textContent = curso.docente;
      row.insertCell().textContent = curso.precio;

      const actionCell = row.insertCell();

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Editar';
      editBtn.className = 'btn btn-info btn-sm me-2';
      editBtn.onclick = () => cargarParaEditar(curso.id_curso);
      actionCell.appendChild(editBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Eliminar';
      deleteBtn.className = 'btn btn-danger btn-sm';
      deleteBtn.onclick = () => eliminarCurso(curso.id_curso, curso.titulo);
      actionCell.appendChild(deleteBtn);
    });
  } catch (e) {
    console.error('Error al obtener cursos:', e);
  }
}

// Eliminar curso
async function eliminarCurso(id, tituloCurso) {
  if (!confirm(`¿Desea eliminar el curso "${tituloCurso}"?`)) return;

  try {
    const response = await fetch(`${API_URL_CURSO}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar');

    const result = await response.json();
    console.log(result);
    obtenerCursos();
  } catch (e) {
    console.error(e);
  }
}

// Cargar datos al formulario para editar
async function cargarParaEditar(id) {
  try {
    const response = await fetch(`${API_URL_CURSO}/${id}`);
    const curso = await response.json();

    idcurso.value = curso.id_curso;
    titulo.value = curso.titulo;
    id_subcat.value = curso.id_subcat;
    fecha_inicio.value = curso.fecha_inicio.split('T')[0]; // eliminar hora
    fecha_fin.value = curso.fecha_fin.split('T')[0];
    duracion_horas.value = curso.duracion_horas;
    id_docente.value = curso.id_docente;
    precio.value = curso.precio;

    btnGuardar.textContent = 'Actualizar';
  } catch (e) {
    console.error('Error al cargar curso:', e);
  }
}

// Guardar / Actualizar curso
formulario.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    titulo: titulo.value,
    id_subcat: id_subcat.value,
    fecha_inicio: fecha_inicio.value,
    fecha_fin: fecha_fin.value,
    duracion_horas: duracion_horas.value,
    id_docente: id_docente.value,
    precio: precio.value,
  };

  try {
    let response;
    if (idcurso.value === '') {
      // Crear
      response = await fetch(API_URL_CURSO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      // Actualizar
      response = await fetch(`${API_URL_CURSO}/${idcurso.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }

    const result = await response.json();
    console.log(result);

    formulario.reset();
    idcurso.value = '';
    btnGuardar.textContent = 'Guardar';
    obtenerCursos();
  } catch (e) {
    console.error(e);
  }
});

// Inicializar app
document.addEventListener('DOMContentLoaded', () => {
  cargarSubcategorias();
  cargarDocentes();
  obtenerCursos();
});
