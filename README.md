# CRUD de Database universidad

Este proyecto es una API REST para gestionar una base de datos de universidad con Node.js, Express y MySQL.

---

## 1. Clonar el repositorio

```bash
git clone https://github.com/fabianalonzo/Entregable-IE_DB_CRUD-con-bootstrap.git
```
## 2. Crear y restaurar la base de datos Abre Workbench y ejecuta:
```
CREATE DATABASE universidad;
USE universidad;

CREATE TABLE docente (
id_docente		INT AUTO_INCREMENT PRIMARY KEY,
nombre			VARCHAR(50) NOT NULL
)ENGINE=INNODB;

CREATE TABLE categoria (
id_categoria	INT AUTO_INCREMENT PRIMARY KEY,
nombre			VARCHAR(100) NOT NULL
)ENGINE=INNODB;

CREATE TABLE subCategoria (
id_subcat		INT AUTO_INCREMENT PRIMARY KEY,
nombre			VARCHAR(100) NOT NULL,
id_categoria	INT NOT NULL,
FOREIGN KEY (id_categoria) REFERENCES  categoria(id_categoria)
)ENGINE=INNODB;

CREATE TABLE curso (
id_curso	INT AUTO_INCREMENT PRIMARY KEY,
titulo		VARCHAR(100) NOT NULL,
id_subcat	INT NOT NULL,
fecha_inicio	DATE NOT NULL,
fecha_fin		DATE NOT NULL,
duracion_horas	DECIMAL(10,2) NOT NULL,
id_docente		INT NOT NULL,
precio			DECIMAL(10,2) NOT NULL,
FOREIGN KEY (id_docente) REFERENCES docente(id_docente),
FOREIGN KEY (id_subcat) REFERENCES subCategoria(id_subcat)
)ENGINE=INNODB;
```
## 3. Abrir el proyecto en VS Code 
```
cd Entregable-IE_DB_CRUD-con-bootstrap
code .
```

## 4. Instalar dependencias En la terminal:
```
npm install
```
## 5. Configurar archivo .env
## Crea un archivo .env en la raíz del proyecto con tus credenciales de base de datos:
```
DB_HOST=localhost
DB_USER=
DB_PASSWORD=
DB_NAME=
PORT=3000
```
## 6. Iniciar servidor
```
nodemon server
```
## 7. Probar la API con Thunder Client o Postman Rutas disponibles:

| Método    | Ruta              | Descripción              |
|  -------- |  ---------------- |  ----------------------- |
| GET       | /api/Tabla        | Listar todas las Tablas  |
| GET       | /api/Tabla/:id    | Obtener una Tabla por ID |
| POST      | /api/Tabla        | Crear una nueva Tabla    |
| PUT       | /api/Tabla/:id    | Actualizar una Tabla     |
| DELETE    | /api/Tabla/:id    | Eliminar una Tabla       |

Asegúrate de usar Content-Type: application/json al enviar datos por POST o PUT.