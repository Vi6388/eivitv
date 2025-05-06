
--------------------------------------
--MUESTRA MENU POR ROLES Y USUARIO
---------------------------------------



-- REGULARIZA SECUENCIALES
CREATE OR REPLACE FUNCTION regularizar_secuencial()
RETURNS VOID AS $$
DECLARE
    tabla_name TEXT;
    secuencia_name TEXT;
BEGIN
    -- Obtener una lista de todas las tablas en el esquema "public"
    FOR tabla_name IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        -- Construir el nombre completo de la secuencia
        secuencia_name := tabla_name || '_id_seq';

        -- Ajustar el secuencial para la tabla actual
        EXECUTE 'SELECT setval($1, (SELECT MAX(id) FROM ' || tabla_name || '));'
        USING secuencia_name;
    END LOOP;
END;
$$ LANGUAGE PLPGSQL;
--SELECT regularizar_secuencial();

--DROP  FUNCTION public.fun_menu;
CREATE OR REPLACE FUNCTION fun_menu(intIdUsuario integer) returns
TABLE(
id        integer,
id_perfil integer,
id_modulo integer,
id_menu   integer,
nombre      character varying,
descripcion character varying, 
icono       character varying,
link        character varying
) AS $$
    DECLARE
        intEstado INTEGER; 
    BEGIN
        intEstado := 1;
         RETURN QUERY  (
				select  
				men.id ,
				perf.id as id_perfil, 
				men.id_modulo, 
				men.id_menu, 
				men.nombre,
				men.descripcion , 
				men.icono,
				(case true
				WHEN  men.link !='' THEN men.link
			    WHEN  modu.tipo = 'gestor' THEN '/gestor/'||modu.nombre 
				ELSE '/' end) AS link 
				from  perfil as perf
				inner join modulo as modu on modu.id= perf.id_modulo
				inner join menu as men on men.id_modulo= modu.id
				inner join rol_perfil as rper 
				on  rper.id_perfil  = perf.id
				and rper.estado = 1
				and rper.id_rol = ( select u.id_rol from usuario u where u.id=intIdUsuario)
				left join usuario_perfil as uper 
				on  uper.id_perfil  = perf.id 
				and uper.estado = 1 
				and uper.id_usuario = intIdUsuario
				where men.estado = 1
				and modu.estado = 1
				and perf.estado = 1 
				group by 
				men.id ,
				perf.id, 
				men.nombre,
				men.descripcion , 
				men.icono,
				men.id_modulo, 
				men.id_menu, 
				men.link,
				modu.tipo,
				modu.nombre
				order by men.orden ASC); 
    END;
$$ LANGUAGE plpgsql;
   
--select * from   fun_menu(2);