const express = require('express');
const router = express.Router();

const subCategoriaController = require('../controllers/subCategoriaController');

router.post('/', subCategoriaController.crearSubCategoria);

router.get('/', subCategoriaController.obtenerSubCategorias);

router.get('/:id', subCategoriaController.obtenerSubCategoriaPorId);

router.put('/:id', subCategoriaController.actualizarSubCategoria);

router.delete('/:id', subCategoriaController.eliminarSubCategoria);

module.exports = router;
