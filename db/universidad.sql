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


INSERT INTO docente (nombre) VALUES 
('Juan Pérez'),
('María Rodríguez'),
('Carlos Gómez'),
('Ana Torres');

INSERT INTO categoria (nombre) VALUES 
('Tecnología'),
('Gestión Empresarial'),
('Mecánica');

INSERT INTO subCategoria (nombre, id_categoria) VALUES 
('Redes y Comunicaciones', 1),
('Administración de Empresas', 2),
('Mecánica Automotriz', 3),
('Ciberseguridad', 1),
('Contabilidad', 2);

INSERT INTO curso (titulo, id_subcat, fecha_inicio, fecha_fin, duracion_horas, id_docente, precio) VALUES 
('Curso de Redes Cisco CCNA', 1, '2025-11-01', '2025-12-15', 80.00, 1, 750.00),
('Gestión de Recursos Humanos', 2, '2025-11-10', '2025-12-20', 60.00, 2, 600.00),
('Técnicas de Mantenimiento Automotriz', 3, '2025-10-20', '2025-12-05', 90.00, 3, 850.00),
('Introducción a la Ciberseguridad', 4, '2025-11-05', '2025-12-15', 70.00, 1, 700.00),
('Contabilidad Financiera Básica', 5, '2025-10-25', '2025-12-10', 65.00, 4, 500.00);

-- SELECT * FROM curso;