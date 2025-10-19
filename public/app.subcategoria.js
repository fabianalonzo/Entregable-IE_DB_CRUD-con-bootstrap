const API_URL_SUBCATEGORIA = 'http://localhost:3000/api/subcategoria';
const API_URL_CATEGORIA = 'http://localhost:3000/api/categoria';

const formulario = document.getElementById('form-subcategoria');
const tabla = document.querySelector('#tabla-subcategoria tbody');

const idsubcat = document.getElementById('idsubcat');
const nombre = document.getElementById('nombre');
const id_categoria = document.getElementById('id_categoria');

const btnGuardar = document.getElementById('btnGuardar');
const btnCancelar = document.getElementById('btnCancelar');

// Limpiar formulario y reiniciar botón guardar
btnCancelar.addEventListener('click', () => {
  btnGuardar.innerText = 'Guardar';
  formulario.reset();
  idsubcat.value = '';
});

// Cargar categorías al <select>
async function cargarCategorias() {
  try {
    const response = await fetch(API_URL_CATEGORIA);
    const categorias = await response.json();

    id_categoria.innerHTML = '<option value="" selected disabled>Seleccione una categoría</option>';
    categorias.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id_categoria;
      option.textContent = cat.nombre;
      id_categoria.appendChild(option);
    });
  } catch (e) {
    console.error('Error al cargar categorías:', e);
  }
}

// Obtener y mostrar subcategorías
async function obtenerSubcategorias() {
  try {
    const response = await fetch(API_URL_SUBCATEGORIA);
    const subcategorias = await response.json();

    tabla.innerHTML = '';
    subcategorias.forEach(subcat => {
      const row = tabla.insertRow();

      row.insertCell().textContent = subcat.id_subcat;
      row.insertCell().textContent = subcat.nombre;
      row.insertCell().textContent = subcat.categoria;

      const actionCell = row.insertCell();

      // Editar
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Editar';
      editBtn.className = 'btn btn-info btn-sm me-2';
      editBtn.onclick = () => cargarParaEdicion(subcat);

      // Eliminar
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Eliminar';
      deleteBtn.className = 'btn btn-danger btn-sm';
      deleteBtn.onclick = () => eliminarSubcategoria(subcat.id_subcat, subcat.nombre);

      actionCell.appendChild(editBtn);
      actionCell.appendChild(deleteBtn);
    });
  } catch (e) {
    console.error('Error al obtener subcategorías:', e);
  }
}

// Eliminar subcategoría
async function eliminarSubcategoria(id, nombre) {
  if (!confirm(`¿Está seguro de eliminar la subcategoría "${nombre}"?`)) return;

  try {
    const response = await fetch(`${API_URL_SUBCATEGORIA}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Error al eliminar');

    const result = await response.json();
    console.log(result);
    obtenerSubcategorias();
  } catch (e) {
    console.error(e);
  }
}

// Cargar subcategoría al formulario para editar
function cargarParaEdicion(subcat) {
  idsubcat.value = subcat.id_subcat;
  nombre.value = subcat.nombre;

  // Debes hacer una consulta adicional si no tienes id_categoria en la tabla
  cargarCategorias().then(() => {
    const option = Array.from(id_categoria.options).find(opt => opt.text === subcat.categoria);
    if (option) option.selected = true;
  });

  btnGuardar.innerText = 'Actualizar';
}

// Guardar o actualizar
formulario.addEventListener('submit', async (event) => {
  event.preventDefault();

  const data = {
    nombre: nombre.value,
    id_categoria: id_categoria.value
  };

  try {
    let response;

    if (idsubcat.value === '') {
      // Crear
      response = await fetch(API_URL_SUBCATEGORIA, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      // Actualizar
      response = await fetch(`${API_URL_SUBCATEGORIA}/${idsubcat.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }

    if (!response.ok) throw new Error('Error en la operación');

    const result = await response.json();
    console.log(result);

    formulario.reset();
    btnGuardar.innerText = 'Guardar';
    idsubcat.value = '';
    obtenerSubcategorias();
  } catch (e) {
    console.error(e);
  }
});

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  cargarCategorias();
  obtenerSubcategorias();
});