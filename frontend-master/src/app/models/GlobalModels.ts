


export class ItemsBox {
  id!: number;
  nombre!: string;
  icono!: string;

}

export class ItemsCatalogo {
  id_catalogo!: number;
  precio!: string;
  descripcion!: string;

}

 
export class ItemProducto {
  id!: string;
  codigo!: string;
  identidad!: string;
  nombre!: string;
  descripcion!: string;
  comision!: string;
  comision_aplica!: string;
  comision_proveedor!: string;
  comision_sistema!: string;
  comision_venta!: string;
  comision_tipo!: string;
  icono!: string;
  referencia_titulo!: string;
  referencia_tipo_dato!: string;
  referencia_longitud!: number;
  tipo_pago!: string;
  recibo_titulo!: string;
  tipo_id!: string;
  tipo_codigo!: string;
  tipo_nombre!: string;
  categoria_id!: string;
  categoria_codigo!: string;
  categoria_nombre!: string;
  proveedor_id!: string;
  proveedor_codigo!: string;
  proveedor_nombre!: string;
}

export class ItemConsultaServicio {
  CodigoResultado!: string;
  Mensaje!: string;
  FechaHoraTransaccion!: string;
  IdTransaccion!: string;
  Identificador!: string;
  RecargarCantidad!: number;
  RecargarEdit!: boolean;
  Nombre!: string;
  DetallesRubros!: Array<DetallesRubros>; 
  Forms!: Array<Fomrs>; 
  constructor() {
    this.CodigoResultado = "";
    this.Mensaje = "";
    this.FechaHoraTransaccion = "";
    this.IdTransaccion = "";
    this.Identificador = "";
    this.RecargarCantidad = 0;
    this.RecargarEdit = true;
    this.Nombre = "";
    this.DetallesRubros = [];
    this.Forms= [];
  }

}

export class DetallesRubros {
  Descripcion!: string;
  IdRubro!: string;
  Prioridad!: number;
  Comision!: number;   
  ValorFijo!: number;
  Valor!: number;
  ValorConComision!: number;
  SePaga: boolean = true;
}

export class Fomrs {
  Id!: string;
  Value!: string; 
}


export class PagoRealizado {
  CodigoResultado!: string;

  CodigoPago!: string;
  CodigoTraceTrx !: string;
  CodigoTransaccion !: string;

  Mensaje!: string;
  FechaHoraTransaccion !: string;
  FechaCierre !: string;
  FechaCompensacion !: string;
  OperadoPor!: string;
  Terminal!: string;
  Producto!: string;
  UrlFactura !: string;
  HTMLRecibo  !: string;
  IdTransaccion !: string;

  DetallesPagos !: Array<DetallesPagos>;

  constructor() {
    this.CodigoResultado = "";
    this.CodigoResultado = "";

    this.CodigoPago = "";
    this.CodigoTraceTrx = "";
    this.CodigoTransaccion = "";

    this.Mensaje = "";
    this.FechaHoraTransaccion = "";
    this.FechaCierre = "";
    this.FechaCompensacion = "";
    this.OperadoPor = "";
    this.Terminal = "";
    this.Producto = "";
    this.UrlFactura = "";
    this.HTMLRecibo = "";
    this.IdTransaccion = "";

    this.DetallesPagos = [];
  }

}

export class DetallesPagos {
  CodigoAutorizacion = '';
  Factura = '';
  IdDRubro = '';
  SecuenciaAdquirente = '';
  SecuenciaSwitch = '';

}

export class ItemCard {
  id = null;
  key = null;
  nombre = '';
  icono = '';
  descripcion = '';
  background = '';

}


export class VerificarCupo {
  total_saldo: number = 0;
  total_comision: number = 0;
}