

var CRUDS = [
    {
        table: 'parametro_cabecera',
        end_point: 'parametro_cabecera',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'codigo', search: true, insert: true, update: true, only: true },
            { nombre: 'nombre', search: true, insert: true, update: true },
            { nombre: 'descripcion', search: false, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },

    {
        table: 'parametro_detalle',
        end_point: 'parametro_detalle',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'id_parametro_cab', search: false, insert: true, update: true },
            { nombre: 'codigo', search: true, insert: true, update: true, only: true },
            { nombre: 'valor', search: true, insert: true, update: true },
            { nombre: 'descripcion', search: false, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },
    //accesos
    {
        table: 'menu',
        end_point: 'menu',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'id_menu', search: false, insert: true, update: true },
            { nombre: 'id_modulo', search: false, insert: true, update: true },
            { nombre: 'codigo', search: true, insert: true, update: true, only: true },
            { nombre: 'icono', search: true, insert: true, update: true },
            { nombre: 'orden', search: false, insert: true, update: true },
            { nombre: 'link', search: false, insert: true, update: true },
            { nombre: 'nombre', search: true, insert: true, update: true },
            { nombre: 'descripcion', search: false, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },


    {
        table: 'modulo',
        end_point: 'modulo',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'codigo', search: true, insert: true, update: true, only: true },
            { nombre: 'nombre', search: true, insert: true, update: true },
            { nombre: 'tipo', search: true, insert: true, update: true },
            { nombre: 'descripcion', search: false, insert: true, update: true },
            { nombre: 'config', search: false, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },
    {
        table: 'accion',
        end_point: 'accion',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'codigo', search: true, insert: true, update: true, only: true },
            { nombre: 'nombre', search: true, insert: true, update: true },
            { nombre: 'descripcion', search: false, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },
    {
        table: 'perfil',
        end_point: 'perfil',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'id_modulo', search: false, insert: true, update: true },
            { nombre: 'codigo', search: true, insert: true, update: true, only: true },
            { nombre: 'nombre', search: true, insert: true, update: true },
            { nombre: 'descripcion', search: false, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },
    {
        table: 'perfil_accion',
        end_point: 'perfil_accion',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'id_perfil', search: false, insert: true, update: true },
            { nombre: 'id_accion', search: false, nsert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },
    {
        table: 'rol_perfil',
        end_point: 'rol_perfil',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'id_perfil', search: false, insert: true, update: true },
            { nombre: 'id_rol', search: false, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },
    {
        table: 'usuario_perfil',
        end_point: 'usuario_perfil',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'id_perfil', search: false, insert: true, update: true },
            { nombre: 'id_usuario', search: false, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },

    {
        table: "pais",
        end_point: "pais",
        columns_show: [
            { nombre: "id", search: false, insert: false, update: false },
            { nombre: "codigo", search: true, insert: true, update: true, only: true },
            { nombre: "nombre", search: true, insert: true, update: true, only: true },
            { nombre: "descripcion", search: false, insert: true, update: true },
            { nombre: "estado", search: false, insert: false, update: true },
            { nombre: "created_at", search: false, insert: false, update: false },
            { nombre: "updated_at", search: false, insert: false, update: false }
        ],
        show_content: {
            view: null,
            select: ["codigo", "nombre"]
        }
    },
    {
        table: "provincia",
        end_point: "provincia",
        columns_show: [
            { nombre: "id", search: false, insert: false, update: false },
            { nombre: "codigo", search: true, insert: true, update: true, only: true },
            { nombre: "id_pais", search: false, insert: true, update: true },
            { nombre: "nombre", search: true, insert: true, update: true, only: true },
            { nombre: "descripcion", search: false, insert: true, update: true },
            { nombre: "estado", search: false, insert: false, update: true },
            { nombre: "created_at", search: false, insert: false, update: false },
            { nombre: "updated_at", search: false, insert: false, update: false }

        ],
        show_content: {
            view: null,
            select: ["codigo", "nombre"]
        }
    },
    {
        table: "canton",
        end_point: "canton",
        columns_show: [
            { nombre: "id", search: false, insert: false, update: false },
            { nombre: "codigo", search: true, insert: true, update: true, only: true },
            { nombre: "id_provincia", search: false, insert: true, update: true },
            { nombre: "nombre", search: true, insert: true, update: true },
            { nombre: "descripcion", search: false, insert: true, update: true },
            { nombre: "estado", search: false, insert: false, update: true },
            { nombre: "created_at", search: false, insert: false, update: false },
            { nombre: "updated_at", search: false, insert: false, update: false }

        ],
        show_content: {
            view: null,
            select: ["codigo", "nombre"]
        }
    },

    {
        table: "rol",
        end_point: "rol",
        columns_show: [
            { nombre: "id", search: false, insert: false, update: false },
            { nombre: "codigo", search: true, insert: true, update: true, only: true },
            { nombre: "nombre", search: true, insert: true, update: true, only: true },
            { nombre: "descripcion", search: false, insert: true, update: true },
            { nombre: "estado", search: false, insert: false, update: true },
            { nombre: "created_at", search: false, insert: false, update: false },
            { nombre: "updated_at", search: false, insert: false, update: false }

        ],
        show_content: {
            view: null,
            select: ["codigo", "nombre"]
        }
    },
    {
        table: "usuario",
        end_point: "usuario",
        columns_show: [
            { nombre: "id", search: false, insert: false, update: false },
            { nombre: "codigo", search: true, insert: true, update: true, only: true },
            { nombre: "id_rol", search: false, insert: true, update: true },
            { nombre: "id_canton", search: false, insert: true, update: true },
            { nombre: "apellidos", search: true, insert: true, update: true },
            { nombre: "nombres", search: true, insert: true, update: true },
            { nombre: "dni", search: true, insert: true, update: true, only: true },
            { nombre: "fecha_nacimiento", search: false, insert: true, update: true },
            { nombre: "direccion", search: false, insert: true, update: true },
            { nombre: "telefono", search: false, insert: true, update: true },
            { nombre: "correo", search: false, insert: true, update: true, only: true },
            { nombre: "foto_img", search: false, insert: true, update: true, },
            { nombre: "fondo_img", search: false, insert: true, update: true, },
            { nombre: "estado", search: false, insert: false, update: true },
            { nombre: "created_at", search: false, insert: false, update: false },
            { nombre: "updated_at", search: false, insert: false, update: false }

        ],
        show_content: {
            view: null,
            select: ["codigo", "nombres", "apellidos"]
        }
    },

    {
        table: 'publicidad',
        end_point: 'publicidad',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'codigo', search: true, insert: true, update: true, only: true },
            { nombre: 'nombre', search: true, insert: true, update: true },
            { nombre: 'descripcion', search: false, insert: true, update: true },
            { nombre: 'imagen', search: false, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },
    {
        table: 'tipo',
        end_point: 'tipo',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'codigo', search: true, insert: true, update: true, only: true },
            { nombre: 'nombre', search: true, insert: true, update: true , only: true },
            { nombre: 'descripcion', search: false, insert: true, update: true },
            { nombre: 'icono', search: false, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },

    {
        table: 'categoria',
        end_point: 'categoria',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'id_tipo', search: false, insert: true, update: true },
            { nombre: 'codigo', search: true, insert: true, update: true, only: true },
            { nombre: 'nombre', search: true, insert: true, update: true , only: true },
            { nombre: 'descripcion', search: false, insert: true, update: true },
            { nombre: 'icono', search: false, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },

    {
        table: 'proveedor',
        end_point: 'proveedor',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'codigo', search: true, insert: true, update: true, only: true },
            { nombre: 'nombre', search: true, insert: true, update: true, only: true },
            { nombre: 'descripcion', search: false, insert: true, update: true },
            { nombre: 'icono', search: false, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },

    {
        table: 'producto',
        end_point: 'producto',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'id_categoria', search: false, insert: true, update: true },
            { nombre: 'id_proveedor', search: false, insert: true, update: true },
            { nombre: 'codigo', search: true, insert: true, update: true, only: true },
            { nombre: 'nombre', search: true, insert: true, update: true , only: true },
            { nombre: 'descripcion', search: false, insert: true, update: true },
            { nombre: 'costo_proveedor', search: false, insert: true, update: true },
            { nombre: 'costo_venta', search: false, insert: true, update: true },
            { nombre: 'aplica_iva', search: false, insert: true, update: true },
            { nombre: 'icono', search: false, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
            //DATOS REQUERIDOS POR RED FACIITO
            { nombre: 'identidad', search: false, insert: true, update: true },
            { nombre: 'comision_aplica', search: false, insert: true, update: true },
            { nombre: 'comision', search: false, insert: true, update: true },
            { nombre: 'comision_proveedor', search: false, insert: true, update: true },
            { nombre: 'comision_sistema', search: false, insert: true, update: true },
            { nombre: 'comision_venta', search: false, insert: true, update: true },
            { nombre: 'comision_tipo', search: false, insert: true, update: true },
            { nombre: 'referencia_titulo', search: false, insert: true, update: true },
            {
                nombre: 'referencia_tipo_dato',
                search: false,
                insert: true,
                update: true,
            },
            {
                nombre: 'referencia_longitud',
                search: false,
                insert: true,
                update: true,
            },
            { nombre: 'tipo_pago', search: false, insert: true, update: true },
            { nombre: 'info_add', search: false, insert: true, update: true },
            { nombre: 'recibo_titulo', search: false, insert: true, update: true },
        ],
    },
    {
        table: 'favoritos',
        end_point: 'favoritos',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'id_producto', search: false, insert: true, update: true },
            { nombre: 'id_usuario', search: false, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },
    //GESTION DE PAGOS
    {
        table: 'banco',
        end_point: 'banco',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'codigo', search: true, insert: true, update: true, only: true },
            { nombre: 'nombre', search: true, insert: true, update: true, only: true },
            { nombre: 'descripcion', search: false, insert: true, update: true },
            { nombre: 'icono', search: false, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },
    {
        table: 'canal_pago',
        end_point: 'canal_pago',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'codigo', search: true, insert: true, update: true, only: true },
            { nombre: 'nombre', search: true, insert: true, update: true, only: true },
            { nombre: 'descripcion', search: false, insert: true, update: true },
            { nombre: 'icono', search: false, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },

    {
        table: 'cuenta',
        end_point: 'cuenta',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'id_banco', search: false, insert: true, update: true },
            { nombre: 'codigo', search: true, insert: true, update: true, only: true },
            { nombre: 'cuenta', search: true, insert: true, update: true, only: true },
            { nombre: 'cedula', search: true, insert: true, update: true },
            { nombre: 'nombre', search: true, insert: true, update: true },
            { nombre: 'descripcion', search: false, insert: true, update: true },
            { nombre: 'icono', search: false, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },
    {
        table: 'cuenta_canal',
        end_point: 'cuenta_canal',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'id_cuenta', search: false, insert: true, update: true },
            { nombre: 'id_canal_pago', search: false, insert: true, update: true },
            { nombre: 'img_baucher', search: false, insert: true, update: true },
            { nombre: 'descripcion', search: true, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ]
    },
    {
        table: 'catalogo_venta',
        end_point: 'catalogo_venta',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'id_producto', search: false, insert: true, update: true },
            { nombre: 'tipo_vendedor', search: false, insert: true, update: true },
            { nombre: 'codigo', search: true, insert: true, update: true, only: true },
            { nombre: 'nombre', search: true, insert: true, update: true },
            { nombre: 'descripcion', search: true, insert: true, update: true },
            { nombre: 'precio', search: true, insert: true, update: true },
            { nombre: 'comision', search: true, insert: true, update: true },
            { nombre: 'observacion', search: false, insert: true, update: true },
            { nombre: 'perfiles', search: false, insert: true, update: true },
            { nombre: 'tipo_duracion', search: false, insert: true, update: true },
            { nombre: 'cantidad_duracion', search: false, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ]
    },
    {
        table: 'digital',
        end_point: 'digital',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'id_producto', search: false, insert: true, update: true },
            { nombre: 'codigo', search: true, insert: true, update: true, only: true },
            { nombre: 'proveedor', search: true, insert: true, update: true },
            { nombre: 'nombre', search: true, insert: true, update: true },
            { nombre: 'descripcion', search: true, insert: true, update: true },
            { nombre: 'costo', search: true, insert: true, update: true },
            { nombre: 'credencial_usuario', search: true, insert: true, update: true },
            { nombre: 'credencial_clave', search: false, insert: true, update: true },
            { nombre: 'credencial_pin', search: false, insert: true, update: true },
            { nombre: 'observacion', search: false, insert: true, update: true },
            { nombre: 'numero_perfil', search: false, insert: true, update: true },
            { nombre: 'fecha_valides_inicio', search: false, insert: true, update: true },
            { nombre: 'fecha_valides_fin', search: false, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },


    {
        table: 'digital_detalle',
        end_point: 'digitales_detalle',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'id_digital', search: false, insert: true, update: true },
            { nombre: 'codigo', search: true, insert: true, update: true, only: true },
            { nombre: 'identificacion', search: true, insert: true, update: true },
            { nombre: 'nombre', search: true, insert: true, update: true },
            { nombre: 'correo', search: true, insert: true, update: true },
            { nombre: 'telefono', search: true, insert: true, update: true },
            { nombre: 'estado', search: false, insert: false, update: true },
            { nombre: 'observacion', search: false, insert: true, update: true },
            { nombre: 'numero_perfil', search: false, insert: true, update: true },
            { nombre: 'fecha_inicio', search: false, insert: true, update: true },
            { nombre: 'fecha_fin', search: false, insert: true, update: true },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },

    {
        view: 'view_manager_recarga_saldo',
        table: 'recarga_saldo',
        end_point: 'recarga_saldo',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'codigo', search: true, insert: false, update: false, only: true },
            { nombre: 'documento', search: true, insert: false, update: false, only: true },
            { nombre: 'fecha', search: false, insert: false, update: false },
            { nombre: 'comprobante', search: false, insert: false, update: false },
            { nombre: 'monto', search: false, insert: false, update: false },
            { nombre: 'descripcion', search: false, insert: false, update: false },
            { nombre: 'status', search: false, insert: false, update: false },
            { nombre: 'motivo', search: false, insert: false, update: false },
            { nombre: 'status_nombre', search: true, insert: false, update: false },
            { nombre: 'id_usuario', search: false, insert: false, update: false },
            { nombre: 'codigo_usuario', search: false, insert: false, update: false },
            { nombre: 'dni', search: true, insert: false, update: false },
            { nombre: 'id_banco', search: false, insert: false, update: false },
            { nombre: 'codigo_banco', search: false, insert: false, update: false },
            { nombre: 'nombre_banco', search: true, insert: false, update: false },
            { nombre: 'id_cuenta', search: false, insert: false, update: false },
            { nombre: 'codigo_cuenta', search: false, insert: false, update: false },
            { nombre: 'nombre_cuenta', search: true, insert: false, update: false },
            { nombre: 'id_canal_pago', search: false, insert: false, update: false },
            { nombre: 'codigo_canal', search: false, insert: false, update: false },
            { nombre: 'nombre_canal', search: true, insert: false, update: false },
            { nombre: 'id_ciudad', search: false, insert: false, update: false },
            { nombre: 'codigo_ciudad', search: false, insert: false, update: false },
            { nombre: 'nombre_ciudad', search: true, insert: false, update: false },
            { nombre: 'created_at', search: false, insert: false, update: false }
        ],
    },
    //FLUJO DE VENTAS

    {
        view: 'view_venta_cabecera',
        table: 'venta_cabecera',
        end_point: 'venta_cabecera',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'id_vendedor', search: false, insert: false, update: false },
            { nombre: 'codigo', search: true, insert: false, update: false, only: true },
            { nombre: 'numero_factura', search: true, insert: false, update: false },
            { nombre: 'observacion', search: false, insert: false, update: false },
            { nombre: 'descripcion', search: false, insert: false, update: false },
            { nombre: 'fecha', search: false, insert: false, update: false },
            { nombre: 'codigo_usuario', search: false, insert: false, update: false },
            { nombre: 'dni', search: false, insert: false, update: false },
            { nombre: 'estado', search: false, insert: false, update: false },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },
    {
        view: 'view_historial_saldo',
        table: 'saldo_historial',
        end_point: 'saldo_historial',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'codigo', search: true, insert: false, update: false, only: true },
            { nombre: 'observacion', search: false, insert: false, update: false },
            { nombre: 'descripcion', search: false, insert: false, update: false },
            { nombre: 'tipo', search: false, insert: false, update: false },
            { nombre: 'anterior', search: false, insert: false, update: false },
            { nombre: 'monto', search: false, insert: false, update: false },
            { nombre: 'actual', search: false, insert: false, update: false },
            { nombre: 'codigo_usuario', search: false, insert: false, update: false },
            { nombre: 'dni', search: false, insert: false, update: false },
            { nombre: 'estado', search: false, insert: false, update: false },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },
    {
        view: 'view_historial_comision',
        table: 'comision_historial',
        end_point: 'comision_historial',
        columns_show: [
            { nombre: 'id', search: false, insert: false, update: false },
            { nombre: 'codigo', search: true, insert: false, update: false, only: true },
            { nombre: 'observacion', search: false, insert: false, update: false },
            { nombre: 'descripcion', search: false, insert: false, update: false },
            { nombre: 'tipo', search: false, insert: false, update: false },
            { nombre: 'anterior', search: false, insert: false, update: false },
            { nombre: 'monto', search: false, insert: false, update: false },
            { nombre: 'actual', search: false, insert: false, update: false },
            { nombre: 'codigo_usuario', search: false, insert: false, update: false },
            { nombre: 'dni', search: false, insert: false, update: false },
            { nombre: 'estado', search: false, insert: false, update: false },
            { nombre: 'created_at', search: false, insert: false, update: false },
            { nombre: 'updated_at', search: false, insert: false, update: false },
        ],
    },
];

module.exports = CRUDS;
