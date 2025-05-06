--------------------------------------
--MUESTRA DATOS A MIGRAR DE EXCEL RED FACILITO
---------------------------------------
--DROP  VIEW public.view_migrate_producto;
CREATE OR REPLACE VIEW public.view_migrate_producto AS
SELECT
	1 AS id_proveedor,
	ct."Identidad" AS identidad,
	ct."Producto" AS codigo,
	ct."Nombre" AS nombre,
	COALESCE(( SELECT ID FROM categoria WHERE nombre LIKE'%' || ct."GRUPO" || '%' ), 1) AS id_categoria,
	ct."Tipo Tramite" AS descripcion,
	( CASE WHEN ct."Comisionx Rubro" = 'S' THEN 1 ELSE 0 END ) AS comision_aplica,
	0 AS comision_tipo,
	0.10 AS comision_venta,
	ct."Titulo Referencia" AS referencia_titulo,
	ct."Tipo Dato Referencia" AS referencia_tipo_dato,
	ct."Longitud Referencia" AS referencia_longitud,
	ct."Tipo Pago" AS tipo_pago,
	ct."Titulo Recibo" AS recibo_titulo,
	1 AS estado 
FROM
	catalogo AS ct;

    --IN
    

INSERT INTO public.producto (
id_proveedor,
identidad,                           
codigo,    
nombre,                                          
id_categoria,
descripcion,            
comision_aplica,
comision_tipo,
comision_venta,
referencia_titulo,                  
referencia_tipo_dato,
referencia_longitud,
tipo_pago,
recibo_titulo,                                                                                         
estado
) (
select 
id_proveedor,
identidad,                           
codigo,    
nombre,                                          
id_categoria,
descripcion,            
comision_aplica,
comision_tipo,
comision_venta,
referencia_titulo,                  
referencia_tipo_dato,
referencia_longitud,
tipo_pago,
recibo_titulo,                                                                                         
estado
from public.view_migrate_producto    
);
