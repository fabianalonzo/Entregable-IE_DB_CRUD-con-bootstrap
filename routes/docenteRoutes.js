//RUTAS = acceso a los recursos
//Verbos:
//GET - Obtener, PUT = Actualizar, POST = crear, DELETE = eliminar
const express = require('express')

//Enrutador
const router = express.Router()

//Acceso = Crear, Listar, etc...
const docenteController = require('../controllers/docenteController')

//Definiendo las rutas
router.post('/', docenteController.crearDocente)

router.get('/', docenteController.obtenerDocentes)

router.get('/:id', docenteController.obtenerDocentePorId)

router.put('/:id', docenteController.actualizarDocente)

router.delete('/:id', docenteController.eliminarDocente)

module.exports = router