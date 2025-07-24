-- Creación de la base de datos
CREATE DATABASE Chibchaweb;

-- Tabla de administradores
CREATE TABLE administrador (
  id_admin VARCHAR(20) PRIMARY KEY,
  nombre_admin VARCHAR(50) NOT NULL,
  apellido_admin VARCHAR(50) NOT NULL,
  correo_admin VARCHAR(255) UNIQUE NOT NULL,
  contrasena_admin VARCHAR(150) NOT NULL,
  fecha_nacimiento_admin DATE
);

-- Tabla de planes para clientes
CREATE TABLE plan_cliente (
  id_pc VARCHAR(10) PRIMARY KEY,
  nombre_plan VARCHAR(100) NOT NULL
);

-- Tabla de dominios
CREATE TABLE dominio (
  nombre_dominio VARCHAR(253),
  TLD VARCHAR(63),
  PRIMARY KEY (nombre_dominio, TLD)
);

-- Tabla de clientes directos
CREATE TABLE cliente_directo (
  id_cliente VARCHAR(50) PRIMARY KEY,
  nombre_cliente VARCHAR(50) NOT NULL,
  apellido_cliente VARCHAR(50) NOT NULL,
  correo_cliente VARCHAR(255) UNIQUE NOT NULL,
  contrasena_cliente VARCHAR(150) NOT NULL,
  telefono VARCHAR(20),
  fecha_nacimiento_cliente DATE
);

-- Tabla de distribuidores
CREATE TABLE distribuidor (
  tipo_doc_id_empresa VARCHAR(10),
  id_empresa VARCHAR(20),
  nombre_empresa VARCHAR(255) NOT NULL,
  correo_empresa VARCHAR(255) UNIQUE NOT NULL,
  contrasena_empresa VARCHAR(150) NOT NULL,
  direccion_empresa VARCHAR(255),
  PRIMARY KEY (tipo_doc_id_empresa, id_empresa)
);

-- Tabla de empleados
CREATE TABLE empleado (
  id_empleado VARCHAR(20) PRIMARY KEY,
  correo_empleado VARCHAR(255) UNIQUE NOT NULL,
  contrasena_empleado VARCHAR(150) NOT NULL,
  nombre_empleado VARCHAR(100) NOT NULL,
  apellido_empleado VARCHAR(100) NOT NULL,
  cargo_empleado VARCHAR(50) NOT NULL,
  fecha_nacimiento_empleado DATE
);

-- Tabla de tickets
CREATE TABLE ticket (
  id_ticket SERIAL PRIMARY KEY,
  asunto VARCHAR(255) NOT NULL,
  descripcion TEXT,
  prioridad VARCHAR(20) CHECK (prioridad IN ('baja', 'media', 'alta')),
  estado VARCHAR(20) CHECK (estado IN ('abierto', 'en proceso','escalado','cerrado'))
);

-- Tabla de métodos de pago
CREATE TABLE metodo_pago (
  id_metodo_pago SERIAL PRIMARY KEY,
  nombre_titular VARCHAR(100) NOT NULL,
  marca_tarjeta VARCHAR(20) NOT NULL,
  numero_tarjeta CHAR(16) NOT NULL UNIQUE,
  tipo_tarjeta VARCHAR(10) NOT NULL CHECK (tipo_tarjeta IN ('Credito', 'Debito', 'Prepago')),
  cvv CHAR(3) NOT NULL CHECK (cvv ~ '^\d{3}$'),
  mes_expiracion CHAR(2) NOT NULL CHECK (mes_expiracion ~ '^(0[1-9]|1[0-2])$'),
  ano_expiracion CHAR(2) NOT NULL CHECK (ano_expiracion ~ '^\d{2}$')
);

-- Tabla de registradores
CREATE TABLE registrador (
  id_registrador VARCHAR(20) PRIMARY KEY,
  nombre_registrador VARCHAR(100) NOT NULL,
  correo_registrador VARCHAR(255) UNIQUE NOT NULL
);