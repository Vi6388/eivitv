CREATE TABLE "categoria" (
"id" serial4 NOT NULL,
"id_tipo" int4,
"codigo" varchar(255),
"nombre" varchar(255),
"descripcion" varchar(500),
"icono" varchar DEFAULT 'assets/default/file.png',
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "producto" (
"id" serial4 NOT NULL,
"id_proveedor" int4,
"id_categoria" int4,
"identidad" varchar(500),
"codigo" varchar(255),
"codigo_barra" varchar(255),
"nombre" varchar(255),
"descripcion" varchar(500),
"aplica_iva" int4,
"costo_venta" decimal(10,4),
"costo_proveedor" decimal(10,4),
"comision_aplica" int4 DEFAULT 0,
"comision" decimal(255,4) DEFAULT 0,
"comision_proveedor" decimal(255,4) DEFAULT 0,
"comision_sistema" decimal(255,4) DEFAULT 0,
"comision_venta" decimal(255,4) DEFAULT 0,
"comision_tipo" int4 DEFAULT 1,
"icono" varchar DEFAULT 'assets/default/file.png',
"referencia_titulo" varchar(255),
"referencia_tipo_dato" varchar(255),
"referencia_longitud" varchar(255),
"tipo_pago" varchar(255),
"recibo_titulo" varchar(255),
"info_add" varchar,
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
COMMENT ON COLUMN "producto"."id" IS 'P= PARCIAL, A=ABONO, T=TOTAL';
COMMENT ON COLUMN "producto"."aplica_iva" IS 'indica si aplica o no iva , 0 para  no y 1 para si';
COMMENT ON COLUMN "producto"."costo_venta" IS 'costo al cliente final , valor neto';
COMMENT ON COLUMN "producto"."comision_aplica" IS '0 = NO y 1 = SI';
COMMENT ON COLUMN "producto"."comision" IS 'recargas en procentaje en base el precio venta, servicio como  es precio fijo';
COMMENT ON COLUMN "producto"."comision_proveedor" IS 'monto que recibe el proveedor';
COMMENT ON COLUMN "producto"."comision_sistema" IS 'monto que recibe sistema ';
COMMENT ON COLUMN "producto"."comision_venta" IS 'monto que recibe agente que realiza la venta';
COMMENT ON COLUMN "producto"."comision_tipo" IS '1 es en porcentaje , 2 es en precio fijo';

CREATE TABLE "producto_imagen" (
"id" serial4 NOT NULL,
"id_producto" int4,
"ruta" varchar(255),
"descripcion" varchar(500),
"orden" int4,
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"update_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "producto_caracteristicas" (
"id" serial4 NOT NULL,
"id_producto" int4,
"id_caracteristica" int2,
"descripcion" varchar(500),
"orden" int4,
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"update_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "caracteristicas" (
"id" serial4 NOT NULL,
"codigo" varchar(255),
"nombre" varchar(255),
"descripcion" varchar(500),
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "pais" (
"id" serial4 NOT NULL,
"codigo" varchar(255),
"nombre" varchar(255),
"descripcion" varchar(500),
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "provincia" (
"id" serial4 NOT NULL,
"id_pais" int4,
"codigo" varchar(255),
"nombre" varchar(255),
"descripcion" varchar(500),
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "canton" (
"id" serial4 NOT NULL,
"id_provincia" int4,
"codigo" varchar(255),
"nombre" varchar(255),
"descripcion" varchar(500),
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "tipo" (
"id" serial4 NOT NULL,
"codigo" varchar(255),
"nombre" varchar(255),
"descripcion" varchar(500),
"icono" varchar DEFAULT 'assets/default/file.png',
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "favoritos" (
"id" serial4 NOT NULL,
"id_producto" int4,
"id_usuario" int4 DEFAULT 0,
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "canal_pago" (
"id" serial4 NOT NULL,
"codigo" varchar(255),
"nombre" varchar(255),
"descripcion" varchar(500),
"icono" varchar DEFAULT 'assets/default/file.png',
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "cuenta" (
"id" serial4 NOT NULL,
"id_banco" int4,
"codigo" varchar(255),
"cuenta" varchar(255),
"cedula" varchar(255),
"nombre" varchar(255),
"descripcion" varchar(500),
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "banco" (
"id" serial4 NOT NULL,
"codigo" varchar(255),
"nombre" varchar(255),
"descripcion" varchar(500),
"icono" varchar DEFAULT 'assets/default/file.png',
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "cuenta_canal" (
"id" serial4 NOT NULL,
"id_cuenta" int4,
"id_canal_pago" int4,
"img_baucher" varchar DEFAULT 'assets/default/file.png',
"descripcion" varchar(500),
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "usuario" (
"id" serial4 NOT NULL,
"id_rol" int4,
"id_canton" int4,
"codigo" varchar(255),
"nombres" varchar(500),
"apellidos" varchar(500),
"dni" varchar(15),
"fecha_nacimiento" varchar(20),
"direccion" varchar(500),
"telefono" varchar(20),
"correo" varchar(500),
"clave" varchar(500),
"foto_img" text DEFAULT 'assets/img/default/user-men.jpg',
"fondo_img" text DEFAULT 'assets/img/default/photo5.jpg',
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
COMMENT ON COLUMN "usuario"."dni" IS 'identificacion , RUC , PASAPORTE , CEDULA';

CREATE TABLE "rol" (
"id" serial4 NOT NULL,
"codigo" varchar(255),
"nombre" varchar(255),
"descripcion" varchar(500),
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "parametro_cabecera" (
"id" serial4 NOT NULL,
"codigo" varchar(255),
"nombre" varchar(255),
"descripcion" varchar(500),
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "parametro_detalle" (
"id" serial4 NOT NULL,
"id_parametro_cab" int4,
"codigo" varchar(255),
"valor" varchar(255),
"descripcion" varchar(500),
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "proveedor" (
"id" serial4 NOT NULL,
"codigo" varchar(255),
"nombre" varchar(255),
"descripcion" varchar(500),
"icono" varchar DEFAULT 'assets/default/file.png',
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "parroquia" (
"id" serial4 NOT NULL,
"id_canton" int4,
"codigo" varchar(255),
"nombre" varchar(255),
"descripcion" varchar(500),
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "digitales" (
"id" serial4 NOT NULL,
"id_categoria" int4,
"codigo" varchar(255),
"usuario" varchar(255),
"clave" varchar(255),
"pin" varchar(255),
"observacion" varchar(500),
"numero_perfil" int4,
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "recarga_saldo" (
"id" serial4 NOT NULL,
"id_cuenta_canal" int4,
"id_usuario" int4,
"codigo" varchar(255),
"documento" varchar(255),
"fecha" timestamp(0),
"comprobante" varchar,
"monto" numeric(255,4),
"status" int4 DEFAULT 0,
"descripcion" varchar(500),
"motivo" varchar(500),
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
COMMENT ON COLUMN "recarga_saldo"."status" IS '0=>NO VERIFICADO, 1 =>APROBADO, 2=>RECHAZADO';

CREATE TABLE "saldo" (
"id" serial4 NOT NULL,
"id_usuario" int4,
"codigo" varchar(255),
"observacion" varchar(500),
"monto" decimal(10,4) DEFAULT 0,
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "saldo_historial" (
"id" serial4 NOT NULL,
"id_saldo" int4,
"codigo" varchar(255),
"observacion" varchar,
"descripcion" varchar DEFAULT 0,
"monto" decimal(10,4) DEFAULT 0,
"total" decimal(10,4) DEFAULT 0,
"tipo" int4,
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
COMMENT ON COLUMN "saldo_historial"."tipo" IS '1=> ingreso , 2=>egreso';

CREATE TABLE "venta_cabecera" (
"id" serial4 NOT NULL,
"id_vendedor" int4,
"id_cliente" int4,
"codigo" varchar(255),
"numero_factura" varchar(255),
"observacion" varchar,
"descripcion" varchar DEFAULT 0,
"fecha" timestamp(0),
"json_detalles" text DEFAULT '{}',
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "venta_detalle" (
"id" serial4 NOT NULL,
"id_venta_cab" int4,
"id_producto" int4,
"observacion" varchar,
"descripcion" varchar DEFAULT 0,
"valor" decimal(4,4),
"comision" decimal(4,4),
"total" decimal(4,4),
"json_detalles" text DEFAULT '{}',
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "cliente" (
"id" serial4 NOT NULL,
"codigo" varchar(200),
"dni" varchar(15),
"nombre" varchar(250),
"apellido" varchar(250),
"telefono" varchar(250),
"correo" varchar(250),
"descripcion" varchar(500),
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "log_tipo" (
"id" serial4 NOT NULL,
"codigo" varchar(255),
"icono" varchar,
"nombre" varchar(255),
"descripcion" varchar(500),
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "log_detalle" (
"id" serial4 NOT NULL,
"id_usuario" int4,
"id_tipo" int4,
"codigo" varchar(255),
"valor" varchar,
"descripcion" varchar(500),
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "codigo_verificacion" (
"id" serial4 NOT NULL,
"id_usuario" int4,
"codigo" varchar(255),
"valor" varchar(255),
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "comision" (
"id" serial4 NOT NULL,
"id_usuario" int4,
"codigo" varchar(255),
"observacion" varchar(500),
"monto" decimal(10,4) DEFAULT 0,
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
CREATE TABLE "comision_historial" (
"id" serial4 NOT NULL,
"id_comision" int4,
"codigo" varchar(255),
"observacion" varchar,
"descripcion" varchar DEFAULT 0,
"monto" decimal(10,4) DEFAULT 0,
"total" decimal(10,4) DEFAULT 0,
"tipo" int4,
"estado" int4,
"created_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
"updated_at" timestamp(0) DEFAULT  timezone('America/Guayaquil',now()),
PRIMARY KEY ("id") 
)
WITHOUT OIDS;
COMMENT ON COLUMN "comision_historial"."tipo" IS '1=> ingreso , 2=>egreso';


ALTER TABLE "producto_imagen" ADD CONSTRAINT "fk_producto_imagen_producto_1" FOREIGN KEY ("id_producto") REFERENCES "producto" ("id");
ALTER TABLE "producto_caracteristicas" ADD CONSTRAINT "fk_producto_caracteristicas_caracteristicas_1" FOREIGN KEY ("id_caracteristica") REFERENCES "caracteristicas" ("id");
ALTER TABLE "producto_caracteristicas" ADD CONSTRAINT "fk_producto_caracteristicas_producto_1" FOREIGN KEY ("id_producto") REFERENCES "producto" ("id");
ALTER TABLE "provincia" ADD CONSTRAINT "fk_provincia_pais_1" FOREIGN KEY ("id_pais") REFERENCES "pais" ("id");
ALTER TABLE "canton" ADD CONSTRAINT "fk_canton_provincia_1" FOREIGN KEY ("id_provincia") REFERENCES "provincia" ("id");
ALTER TABLE "favoritos" ADD CONSTRAINT "fk_favoritos_producto_1" FOREIGN KEY ("id_producto") REFERENCES "producto" ("id");
ALTER TABLE "cuenta" ADD CONSTRAINT "fk_cuenta_banco_1" FOREIGN KEY ("id_banco") REFERENCES "banco" ("id");
ALTER TABLE "cuenta_canal" ADD CONSTRAINT "fk_cuenta_canal_canal_pago_1" FOREIGN KEY ("id_canal_pago") REFERENCES "canal_pago" ("id");
ALTER TABLE "cuenta_canal" ADD CONSTRAINT "fk_cuenta_canal_cuenta_1" FOREIGN KEY ("id_cuenta") REFERENCES "cuenta" ("id");
ALTER TABLE "usuario" ADD CONSTRAINT "fk_usuario_rol_1" FOREIGN KEY ("id_rol") REFERENCES "rol" ("id");
ALTER TABLE "parametro_detalle" ADD CONSTRAINT "fk_parametro_detalle_parametro_cabecera_1" FOREIGN KEY ("id_parametro_cab") REFERENCES "parametro_cabecera" ("id");
ALTER TABLE "producto" ADD CONSTRAINT "fk_producto_categoria_1" FOREIGN KEY ("id_categoria") REFERENCES "categoria" ("id");
ALTER TABLE "categoria" ADD CONSTRAINT "fk_categoria_tipo_1" FOREIGN KEY ("id_tipo") REFERENCES "tipo" ("id");
ALTER TABLE "producto" ADD CONSTRAINT "fk_producto_proveedor_1" FOREIGN KEY ("id_proveedor") REFERENCES "proveedor" ("id");
ALTER TABLE "usuario" ADD CONSTRAINT "fk_usuario_canton_1" FOREIGN KEY ("id_canton") REFERENCES "canton" ("id");
ALTER TABLE "parroquia" ADD CONSTRAINT "fk_parroquia_canton_1" FOREIGN KEY ("id_canton") REFERENCES "canton" ("id");
ALTER TABLE "recarga_saldo" ADD CONSTRAINT "fk_recarga_saldo_cuenta_canal_1" FOREIGN KEY ("id_cuenta_canal") REFERENCES "cuenta_canal" ("id");
ALTER TABLE "recarga_saldo" ADD CONSTRAINT "fk_recarga_saldo_usuario_1" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id");
ALTER TABLE "saldo" ADD CONSTRAINT "fk_saldo_usuario_1" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id");
ALTER TABLE "saldo_historial" ADD CONSTRAINT "fk_saldo_historial_saldo_1" FOREIGN KEY ("id_saldo") REFERENCES "saldo" ("id");
ALTER TABLE "venta_detalle" ADD CONSTRAINT "fk_venta_detalle_venta_cabecera_1" FOREIGN KEY ("id_venta_cab") REFERENCES "venta_cabecera" ("id");
ALTER TABLE "venta_detalle" ADD CONSTRAINT "fk_venta_detalle_producto_1" FOREIGN KEY ("id_producto") REFERENCES "producto" ("id");
ALTER TABLE "venta_cabecera" ADD CONSTRAINT "fk_venta_cabecera_cliente_1" FOREIGN KEY ("id_cliente") REFERENCES "cliente" ("id");
ALTER TABLE "log_detalle" ADD CONSTRAINT "fk_log_detalle_log_tipo_1" FOREIGN KEY ("id_tipo") REFERENCES "log_tipo" ("id");
ALTER TABLE "log_detalle" ADD CONSTRAINT "fk_log_detalle_usuario_1" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id");
ALTER TABLE "comision_historial" ADD CONSTRAINT "fk_comision_historial_comision_1" FOREIGN KEY ("id_comision") REFERENCES "comision" ("id");
ALTER TABLE "comision" ADD CONSTRAINT "fk_comision_usuario_1" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id");

