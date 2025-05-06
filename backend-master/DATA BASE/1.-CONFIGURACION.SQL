--alter system set idle_in_transaction_session_timeout='5min'; --0 PARA DESABILITAR
--alter system set TimeZone ='GMT'; 

--eliminar relaciones
delete from rol_perfil;
delete from usuario_perfil;
delete from perfil;



--obtener perfiles de modulo
INSERT INTO perfil (id_modulo, codigo, nombre, descripcion)
SELECT
    m.id AS id_menu,
    m.id AS codigo,
    m.nombre || '_all' AS nombre,
    descripcion, 
    1 as estado
FROM
    modulo m
WHERE
    m.nombre NOT IN ('default')
ORDER BY
    m.id;

--obtener perfiles roles
INSERT INTO rol_perfil(id_rol, id_perfil, estado)
SELECT
    1 AS id_rol,
    p.id AS id_perfil,
    1 AS estado
FROM
    perfil p;
