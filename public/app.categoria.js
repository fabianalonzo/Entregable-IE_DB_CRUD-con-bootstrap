const API_URL = 'http://localhost:3000/api/categoria'

const formulario = document.getElementById('form-categoria')
const tabla = document.querySelector('#tabla-categoria tbody')

const idcategoria = document.getElementById('idcategoria')
const nombre = document.getElementById('nombre') //elemento de formulario

const btnGuardar = document.getElementById('btnGuardar')
const btnCancelar = document.getElementById('btnCancelar')

//Retorna el botón guardar a su estado original
btnCancelar.addEventListener('click', () => {
  btnGuardar.innerText = 'Guardar'
  idcategoria.value = ''  // <- limpia el ID para que no actualice
})

//Obtener los datos (backend) > renderizar en la tabla
async function obtenerCategorias(){
  const response = await fetch(API_URL, { method: 'get' })
  const categorias = await response.json()
  //console.log(productos)

  //Reiniciamos el contenido de la tabla
  tabla.innerHTML = '';
  
  categorias.forEach(categoria => {
    //Crear una nueva fila y celdas con los datos contenidos en JSON
    const row = tabla.insertRow() //<tr></tr>

    row.insertCell().textContent = categoria.id_categoria //<td></td>
    row.insertCell().textContent = categoria.nombre //<td></td>
    
    //La última celda contendrá 2 botones (funcionalidad)
    const actionCell = row.insertCell()

    //Botón 1: Editar
    const editButton = document.createElement('button')
    editButton.textContent = 'Editar'
    editButton.classList.add('btn')
    editButton.classList.add('btn-info')
    editButton.classList.add('btn-sm')
    editButton.onclick = () => cargarParaEdicion(categoria)

    //Botón 2: Eliminar
    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Eliminar'
    deleteButton.classList.add('btn')
    deleteButton.classList.add('btn-danger')
    deleteButton.classList.add('btn-sm')
    deleteButton.onclick = () => eliminarCategoria(categoria.id_categoria, categoria.nombre)

    //Agregando ambos botones a la última celda
    actionCell.appendChild(editButton)
    actionCell.appendChild(deleteButton)
  });
}

async function eliminarCategoria(id_categoria, nombre){
  //console.log(id, descripcion)
  if (confirm(`¿Está seguro de eliminar la categoria: ${nombre}?`)){ 
    try{
      const response = await fetch(API_URL + `/${id_categoria}` , { method: 'delete' })
      
      if (!response.ok){
        throw new Error(`Error al eliminar: ${nombre}`)
      }

      //Eliminado correctamente...
      const result = await response.json()
      console.log(result)
      obtenerCategorias()

    }catch(e){
      console.error(e)
    }
  }
}

async function cargarParaEdicion(categoria){
  idcategoria.value = categoria.id_categoria
  nombre.value = categoria.nombre

  btnGuardar.innerText = 'Actualizar'
}

//Al pulsar el botón Guardar (submit) - DEBEMOS VERIFICAR SI: registrar | actualizar
formulario.addEventListener("submit", async (event) => {
  event.preventDefault() //Anulado el evento submit

  //Para guardar, necesitamos almacenar los datos en formato JSON
  //preparamos un objeto JS con la misma estructura
  const data = {
    nombre: nombre.value
  }

  //Enviar los datos (1. URL, 2. Verbo, 3. Tipo dato, 4. JSON)
  try{
    //¿Actualizamos o registramos?
    let response = null

    if (idcategoria.value == ''){
      response = await fetch(API_URL, { 
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
    }else{
      //Actualizar...
      response = await fetch(API_URL + `/${idcategoria.value}`, { 
        method: 'put',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
    }
    
    const result = await response.json()
    console.log(result)
    btnGuardar.innerText = 'Guardar'
    formulario.reset()
    obtenerCategorias()
  }catch(e){
    console.error(e)
  }
})

//Cuando la página esté lista, se ejecutará obtenerProductos
document.addEventListener('DOMContentLoaded', obtenerCategorias)