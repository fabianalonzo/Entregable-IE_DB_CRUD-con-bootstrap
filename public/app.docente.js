const API_URL = 'http://localhost:3000/api/docente'

const formulario = document.getElementById('form-docente')
const tabla = document.querySelector('#tabla-docente tbody')

const iddocente = document.getElementById('iddocente')
const nombre = document.getElementById('nombre') //elemento de formulario

const btnGuardar = document.getElementById('btnGuardar')
const btnCancelar = document.getElementById('btnCancelar')

//Retorna el botón guardar a su estado original
btnCancelar.addEventListener('click', () => {
  btnGuardar.innerText = 'Guardar'
  iddocente.value = ''  // <- limpia el ID para que no actualice
})

//Obtener los datos (backend) > renderizar en la tabla
async function obtenerDocentes(){
  const response = await fetch(API_URL, { method: 'get' })
  const docentes = await response.json()
  //console.log(productos)

  //Reiniciamos el contenido de la tabla
  tabla.innerHTML = '';
  
  docentes.forEach(docente => {
    //Crear una nueva fila y celdas con los datos contenidos en JSON
    const row = tabla.insertRow() //<tr></tr>

    row.insertCell().textContent = docente.id_docente //<td></td>
    row.insertCell().textContent = docente.nombre //<td></td>
    
    //La última celda contendrá 2 botones (funcionalidad)
    const actionCell = row.insertCell()

    //Botón 1: Editar
    const editButton = document.createElement('button')
    editButton.textContent = 'Editar'
    editButton.classList.add('btn')
    editButton.classList.add('btn-info')
    editButton.classList.add('btn-sm')
    editButton.onclick = () => cargarParaEdicion(docente)

    //Botón 2: Eliminar
    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Eliminar'
    deleteButton.classList.add('btn')
    deleteButton.classList.add('btn-danger')
    deleteButton.classList.add('btn-sm')
    deleteButton.onclick = () => eliminarDocente(docente.id_docente, docente.nombre)

    //Agregando ambos botones a la última celda
    actionCell.appendChild(editButton)
    actionCell.appendChild(deleteButton)
  });
}

async function eliminarDocente(id_docente, nombre){
  //console.log(id, descripcion)
  if (confirm(`¿Está seguro de eliminar el docente: ${nombre}?`)){ 
    try{
      const response = await fetch(API_URL + `/${id_docente}` , { method: 'delete' })
      
      if (!response.ok){
        throw new Error(`Error al eliminar: ${nombre}`)
      }

      //Eliminado correctamente...
      const result = await response.json()
      console.log(result)
      obtenerDocentes()

    }catch(e){
      console.error(e)
    }
  }
}

async function cargarParaEdicion(docente){
  iddocente.value = docente.id_docente
  nombre.value = docente.nombre

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

    if (iddocente.value == ''){
      response = await fetch(API_URL, { 
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
    }else{
      //Actualizar...
      response = await fetch(API_URL + `/${iddocente.value}`, { 
        method: 'put',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
    }
    
    const result = await response.json()
    console.log(result)
    btnGuardar.innerText = 'Guardar'
    formulario.reset()
    obtenerDocentes()
  }catch(e){
    console.error(e)
  }
})

//Cuando la página esté lista, se ejecutará obtenerProductos
document.addEventListener('DOMContentLoaded', obtenerDocentes)