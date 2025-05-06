--------------------------------------
--MUESTRA TABLERO DE  TIPO
---------------------------------------
--DROP  VIEW public.view_board_tipo;
CREATE OR REPLACE VIEW public.view_board_tipo AS
select  t.* from tipo t 
where t.estado =1
order by t.id asc  ;


--------------------------------------
--MUESTRA TABLERO DE CATEGORIA
---------------------------------------
--DROP  VIEW public.view_board_categoria;
CREATE OR REPLACE VIEW public.view_board_categoria AS
select  c.* from categoria c
inner join view_board_tipo vbt on vbt.id=c.id_tipo 
where c.estado =1
order by c.id asc  ;
 


--------------------------------------
--MUESTRA TABLERO DE  PRODUCTOS
---------------------------------------
--DROP  VIEW public.view_board_productos;
CREATE OR REPLACE VIEW public.view_board_productos AS
select  p.* from producto p 
inner join view_board_categoria vbc on vbc.id = p.id_categoria 
where p.estado =1
order by p.nombre;

--------------------------------------
--MUESTRA TABLERO DE  PRODUCTOS FAVORITOS
---------------------------------------
--DROP  VIEW public.view_board_productos_favoritos;
CREATE OR REPLACE VIEW public.view_board_productos_favoritos AS
select 
vbp.*, 
fa.id as id_favorito ,
fa.id_usuario as id_usuario
from view_board_productos vbp 
inner join favoritos as fa on  fa.id_producto  = vbp.id
where fa.estado = 1;  



--------------------------------------
--MUESTRA CUENTAS BANCARIAS
---------------------------------------
--DROP  VIEW public.view_cuentas_bancarias;
CREATE OR REPLACE VIEW public.view_cuentas_bancarias AS
select
cu.*,
ba.nombre as banco_nombre,
ba.icono as banco_icono
from cuenta cu  
inner join banco ba ON  cu.id_banco  = ba.id 
where cu.estado = 1;  


--------------------------------------
--MUESTRA CUENTAS BANCARIAS CANALES
---------------------------------------
--DROP  VIEW public.view_cuentas_bancarias_canales;
CREATE OR REPLACE VIEW public.view_cuentas_bancarias_canales AS
select
cc.id as id_cuenta_canal,
cc.id_cuenta ,
cc.id_canal_pago ,
cc.img_baucher ,
cc.descripcion,
cp.nombre 
from cuenta_canal cc 
inner join canal_pago cp ON  cc.id_canal_pago  = cp.id 
where cc.estado = 1 and cp.estado = 1;  



--------------------------------------
--MUESTRA INFORMACION DEL USUARIO
---------------------------------------
--DROP  VIEW public.view_usuario_login;
CREATE OR REPLACE VIEW public.view_usuario_login AS
select 
u.* , 
split_part(u.nombres ,' ',1)  as nombre, 
split_part(u.apellidos ,' ',1) as apellido,
r.nombre as nombre_rol ,
pro.id_pais,
COALESCE(pas.nombre, 'SD') as pais,
can.id_provincia,
COALESCE(pro.nombre, 'SD') as provincia,
COALESCE(can.nombre, 'SD') as canton
from usuario u 
inner join rol r on r.id  = u.id_rol 
left join canton can on can.id  = u.id_canton 
left join provincia pro on pro.id  = can.id_provincia
left join pais pas on pas.id  = pro.id_pais;

--------------------------------------
--MUESTRA PRODUCTOS
---------------------------------------
--DROP  VIEW public.view_productos;
CREATE OR REPLACE VIEW public.view_productos AS
select
pro.id ,
pro.codigo ,
pro.identidad,
pro.nombre ,
pro.descripcion ,
pro.comision , 
pro.comision_aplica,
pro.comision_proveedor ,
pro.comision_sistema , 
pro.comision_venta , 
pro.comision_tipo ,
pro.icono,
pro.referencia_titulo, 
pro.referencia_tipo_dato, 
pro.referencia_longitud, 
pro.tipo_pago,
pro.recibo_titulo,

tip.id as tipo_id, 
tip.codigo as tipo_codigo, 
tip.nombre as tipo_nombre,

cat.id as categoria_id, 
cat.codigo as categoria_codigo, 
cat.nombre as categoria_nombre,

prv.id as proveedor_id, 
prv.codigo as proveedor_codigo, 
prv.nombre as proveedor_nombre	
	
from producto pro
inner join proveedor prv on prv.id = pro.id_proveedor 
inner join categoria cat on cat.id= pro.id_categoria 
inner join tipo tip on tip.id  = cat.id_tipo; 



--------------------------------------
--MUESTRA RECARGAS DE SALDOS
---------------------------------------
--DROP  VIEW public.view_recarga_saldo;
CREATE OR REPLACE VIEW public.view_recarga_saldo AS
select
rs.id as id_recarga_saldo, 
rs.id_cuenta_canal ,
rs.codigo as codigo_recarga ,
rs.documento ,
rs.fecha , 
rs.comprobante , 
rs.monto , 
rs.descripcion, 
rs.id_usuario ,
rs.status,
( 
CASE 
WHEN rs.status = 0 THEN 'VERIFICAR'
WHEN rs.status = 1 THEN 'APROBADO'
WHEN rs.status = 2 THEN 'RECHAZADO'
ELSE 'NO DEFINIDO' END
) as status_nombre,
u.codigo as codigo_usuario, 
u.nombres, 
u.apellidos, 
u.dni,
u.correo, 
u.foto_img,
c.id_banco , 
b.codigo  as codigo_banco,
b.nombre as nombre_banco,
cc.id_cuenta , 
c.codigo  as codigo_cuenta, 
c.cuenta as nombre_cuenta, 
cc.id_canal_pago ,
cp.codigo  as codigo_canal, 
cp.nombre as nombre_canal, 
rs.motivo

from recarga_saldo rs 
inner join usuario u on u.id = rs.id_usuario 
inner join cuenta_canal cc  on cc.id = rs.id_cuenta_canal 
inner join cuenta c on c.id = cc.id_cuenta 
inner join banco b on b.id = c.id_banco 
inner join canal_pago cp on cp.id = cc.id_canal_pago; 


--------------------------------------
--MUESTRA INFORMACION DEL LOG DE USUARIO
---------------------------------------
--DROP  VIEW public.view_log_detalle;
CREATE OR REPLACE VIEW public.view_log_detalle AS
select 
lt.icono,
lt.nombre,
lt.descripcion as esquema,
ld.codigo,
ld.id_usuario, 
ld.valor,
ld.descripcion,  
ld.updated_at as fecha,
ld.estado
from log_detalle ld 
inner join log_tipo  as lt on ld.id_tipo = lt.id 
where lt.estado= 1;



































 


--------------------------------------
--MUESTRA MANAGER RECARGAS DE SALDOS
---------------------------------------
--DROP  VIEW public.view_manager_recarga_saldo;
CREATE OR REPLACE VIEW public.view_manager_recarga_saldo AS
select
rs.id, 
rs.codigo,
rs.documento ,
rs.fecha , 
rs.comprobante , 
rs.monto , 
rs.descripcion, 
rs.status,
rs.motivo,
rs.estado,
rs.created_at,
( 
CASE 
WHEN rs.status = 0 THEN 'VERIFICAR'
WHEN rs.status = 1 THEN 'APROBADO'
WHEN rs.status = 2 THEN 'RECHAZADO'
ELSE 'NO DEFINIDO' END
) as status_nombre,

rs.id_usuario,
u.codigo as codigo_usuario,
u.dni,
c.id_banco , 
b.codigo  as codigo_banco,
b.nombre as nombre_banco,
cc.id_cuenta , 
c.codigo  as codigo_cuenta, 
c.cuenta as nombre_cuenta, 
cc.id_canal_pago ,
cp.codigo  as codigo_canal, 
cp.nombre as nombre_canal,
u.id_canton as id_ciudad,
c2.codigo  as codigo_ciudad,
c2.nombre  as nombre_ciudad

from recarga_saldo rs 
inner join usuario u on u.id = rs.id_usuario 
inner join canton c2  on c2.id  = u.id_canton 
inner join cuenta_canal cc  on cc.id = rs.id_cuenta_canal 
inner join cuenta c on c.id = cc.id_cuenta 
inner join banco b on b.id = c.id_banco 
inner join canal_pago cp on cp.id = cc.id_canal_pago
order by rs.created_at  desc; 



--------------------------------------
--MUESTRA HISTORIAL DE SALDO POR USUARIO
---------------------------------------
--DROP  VIEW public.view_historial_saldo;
CREATE OR REPLACE VIEW public.view_historial_saldo AS
select
sh.id,  
sh.codigo, 
sh.observacion ,   
sh.descripcion,
sh.monto,
sh.anterior,
sh.actual,
sh.estado, 
sh.created_at,
sh.updated_at,
( 
CASE 
WHEN sh.tipo = 1 THEN 'INGRESO'
WHEN sh.tipo = 2 THEN 'EGRESO' 
ELSE 'NO DEFINIDO' END
) as tipo,
u.id as id_usuario,
u.codigo as codigo_usuario, 
u.dni

from saldo_historial sh 
inner join saldo s ON sh.id_saldo = s.id 
inner join usuario u on u.id = s.id_usuario 
order by sh.id desc; 

--------------------------------------
--MUESTRA HISTORIAL DE COMISION POR USUARIO
---------------------------------------
--DROP  VIEW public.view_historial_comision;
CREATE OR REPLACE VIEW public.view_historial_comision AS
select
sh.id,  
sh.codigo, 
sh.observacion ,   
sh.descripcion,
sh.monto,
sh.anterior,
sh.actual,
sh.estado, 
sh.created_at,
sh.updated_at,
( 
CASE 
WHEN sh.tipo = 1 THEN 'INGRESO'
WHEN sh.tipo = 2 THEN 'EGRESO' 
ELSE 'NO DEFINIDO' END
) as tipo,
u.id as id_usuario,
u.codigo as codigo_usuario, 
u.dni

from comision_historial sh 
inner join comision s ON sh.id_comision = s.id 
inner join usuario u on u.id = s.id_usuario 
order by sh.id desc; 



--------------------------------------
--MUESTRA CABECERA DE VENTA
---------------------------------------
--DROP  VIEW public.view_venta_cabecera;
CREATE OR REPLACE VIEW public.view_venta_cabecera AS
select
vc.id,  
vc.id_cliente,
vc.codigo,
vc.numero_factura,
vc.observacion,
vc.descripcion,
vc.fecha,
vc.json_detalles,
vc.estado,
vc.created_at,
vc.updated_at,
u.id as id_usuario,
u.codigo as codigo_usuario, 
u.dni
from venta_cabecera vc 
inner join usuario u on u.id = vc.id_vendedor 
order by vc.id desc; 


 