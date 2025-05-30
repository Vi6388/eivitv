import { AfterViewInit, Component, OnInit } from '@angular/core';
import { usuarioModel } from 'src/app/models/UsuarioModel';
import { ItemCard, ItemsBox, PagoRealizado, ItemProducto, DetallesRubros, ItemConsultaServicio, VerificarCupo, ItemsCatalogo } from 'src/app/models/GlobalModels';
import { GlobalService } from 'src/app/service/global.service';
import { UtilitariosService } from 'src/app/service/utilitarios.service';
import { Constantes } from 'src/app/models/Constantes';
declare let $: any;
declare let document: any;
declare var alertify: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  filtro: string = ''; // Añadido para el buscador
  isLoading: boolean = false; // Para controlar el preloader
  data_publicidad: ItemCard[] = [];
  data_tipos: ItemCard[] = [];
  data_servicios_ciudad: ItemCard[] = [];
  data_producto_favoritos: ItemCard[] = [];
  data_categorias: ItemCard[] = [];
  data_productos: ItemProducto[] = [];
  item_tipo!: ItemsBox;
  item_categoria!: ItemsBox;
  item_producto!: ItemsBox;
  dataUsuario: usuarioModel = UtilitariosService.getDataUsuario();
  dataPagoRealizado: PagoRealizado = new PagoRealizado();
  itemConsultaServicio: ItemConsultaServicio = new ItemConsultaServicio();
  static i: any;
  dataTablaRubros: any = null;
  data_cupo: VerificarCupo = new VerificarCupo();

  dataInit = {
    tituloServiciosCiudad: `En la ciudad de ${this.dataUsuario.canton}`,
    tituloFavoritos: 'Favoritos',
    tituloTipo: 'Tipo de servicios',
    tituloPublicidad: 'Publicidades'
  };

  // Guardar datos originales para el filtrado
  private originalData = {
    servicios_ciudad: [] as ItemCard[],
    favoritos: [] as ItemCard[],
    tipos: [] as ItemCard[],
    publicidad: [] as ItemCard[]
  };

  constructor() {}

  ngOnInit(): void {
    this.isLoading = true;
    UtilitariosService.getVericarSession();
    this.initPublicidades();
    this.initServiciosCiudad();
    this.initFavoritos();
    this.initTipos();
    HomeComponent.i = this;
    this.isLoading = false;
  }

  ngAfterViewInit(): void {
    UtilitariosService.configurarTab();
  }

  async initServiciosCiudad() {
    this.isLoading = true;
    const canton = this.dataUsuario.canton;
    this.data_servicios_ciudad = [];
    const endPoint = 'dasboard/producto/list';
    const res: any = await GlobalService.Post(endPoint, { canton });
    if (res.status === 200) {
      this.data_servicios_ciudad = res.data;
      this.originalData.servicios_ciudad = [...res.data];
    }
    this.isLoading = false;
  }

  async initFavoritos() {
    this.isLoading = true;
    const id_usuario = this.dataUsuario.id;
    const endPoint = 'dasboard/favorito/list';
    const res: any = await GlobalService.Post(endPoint, {});
    if (res.status === 200) {
      this.data_producto_favoritos = res.data;
      this.originalData.favoritos = [...res.data];
    }
    this.isLoading = false;
  }

  async initTipos() {
    this.isLoading = true;
    this.data_tipos = [];
    const endPoint = 'dasboard/tipo/list';
    const res: any = await GlobalService.Post(endPoint, {});
    if (res.status === 200) {
      this.data_tipos = res.data;
      this.originalData.tipos = [...res.data];
    }
    this.isLoading = false;
  }

  async initPublicidades() {
    this.isLoading = true;
    this.data_publicidad = [];
    const endPoint = 'dasboard/publicidad/list';
    const res: any = await GlobalService.Post(endPoint, {});
    if (res.status === 200) {
      this.data_publicidad = res.data;
      this.originalData.publicidad = [...res.data];
    }
    this.isLoading = false;
  }

  // Implementación del filtro en tiempo real
  filtrarProductos() {
    this.isLoading = true;
    const filtroLower = this.filtro.toLowerCase();

    if (!filtroLower) {
      // Restaurar datos originales si el filtro está vacío
      this.data_servicios_ciudad = [...this.originalData.servicios_ciudad];
      this.data_producto_favoritos = [...this.originalData.favoritos];
      this.data_tipos = [...this.originalData.tipos];
      this.data_publicidad = [...this.originalData.publicidad];
    } else {
      // Filtrar localmente
      this.data_servicios_ciudad = this.originalData.servicios_ciudad.filter(item =>
        item.nombre.toLowerCase().includes(filtroLower)
      );
      this.data_producto_favoritos = this.originalData.favoritos.filter(item =>
        item.nombre.toLowerCase().includes(filtroLower)
      );
      this.data_tipos = this.originalData.tipos.filter(item =>
        item.nombre.toLowerCase().includes(filtroLower)
      );
      this.data_publicidad = this.originalData.publicidad.filter(item =>
        item.nombre.toLowerCase().includes(filtroLower)
      );
    }

    this.isLoading = false;
  }

  async busquedaDirecta() {
    this.isLoading = true;
    const val = this.filtro;
    const title = `BUSQUEDA DE: ${val.toUpperCase()}`;
    const idEl = 'id_items_productos';
    const html = `<div class="modal-body">
                    <div id="${idEl}" class="col-sm-12 row"></div>
                  </div>`;
    alertify.modalEstandarProducto(html).setHeader(title);
    await this.cargarProductosCategoria(idEl, null, val);
    this.isLoading = false;
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.busquedaDirecta();
    }
  }

  async verificarCupo() {
    const endPoint = 'saldos/visualizar/cupos';
    const res: any = await GlobalService.Post(endPoint, {});
    if (res.status === 200) {
      this.data_cupo = res.data;
    }
  }

  async cargarCategoria(idEl: string, id_tipo: string) {
    this.isLoading = true;
    this.data_categorias = [];
    const endPoint = 'dasboard/categoria/list';
    const res: any = await GlobalService.Post(endPoint, { id_tipo });
    if (res.status === 200) {
      this.data_categorias = res.data;
      $(`#${idEl}`).empty();
      for (const item of this.data_categorias) {
        const html = this.renderCardItem({ ...item, key: idEl + item.id, background: 'bg-info' });
        $(`#${idEl}`).append(html);
        const cargarModal = () => this.cargarModalProductos(item);
        document.getElementById(idEl + item.id)?.addEventListener('click', cargarModal);
      }
    }
    this.isLoading = false;
    UtilitariosService.loadingElementOff('idHtml');
  }

  async cargarProductosCategoria(idEl: string, id_categoria: string | null, nombre: string | null) {
    this.isLoading = true;
    this.data_productos = [];
    const endPoint = 'dasboard/producto/list';
    const res: any = await GlobalService.Post(endPoint, { id_categoria, nombre });
    if (res.status === 200) {
      this.data_productos = res.data;
      $(`#${idEl}`).empty();
      for (const item of this.data_productos) {
        const html = this.renderCardItem({ ...item, key: idEl + item.id, background: 'bg-primary' });
        $(`#${idEl}`).append(html);
        const cargarModal = () => this.cargarModalVisualizarProducto({ ...item, titulo: '' });
        document.getElementById(idEl + item.id)?.addEventListener('click', cargarModal);
      }
    }
    this.isLoading = false;
    UtilitariosService.loadingElementOff('idHtml');
  }

  showServiciosCiudad(item: ItemCard) {
    $('.ms-box-focus').removeClass('ms-box-focus-active');
    $(`#id_servicios_ciudad_${item.id}`).addClass('ms-box-focus-active');
    this.cargarModalVisualizarProducto({ ...item, titulo: this.dataInit.tituloServiciosCiudad });
  }

  showProductosFavorito(item: ItemCard) {
    $('.ms-box-focus').removeClass('ms-box-focus-active');
    $(`#id_producto_favorito_${item.id}`).addClass('ms-box-focus-active');
    this.cargarModalVisualizarProducto({ ...item, titulo: this.dataInit.tituloFavoritos });
  }

  showCategoria(item: ItemCard) {
    $('.ms-box-focus').removeClass('ms-box-focus-active');
    $(`#id_tipo_producto_${item.id}`).addClass('ms-box-focus-active');
    this.cargarModalCategoria({ ...item, titulo: this.dataInit.tituloTipo });
  }

  showPublicidad(item: ItemCard) {
    $('.ms-box-focus').removeClass('ms-box-focus-active');
    $(`#id_publicidad_${item.id}`).addClass('ms-box-focus-active');
    this.cargarModalPublicidad({ ...item, titulo: this.dataInit.tituloPublicidad });
  }

  cargarModalPublicidad(item: any) {
    const title = item.titulo.toUpperCase();
    const html = `
      <img class="elevation-2" src="${item.imagen}" alt="${item.nombre}" width="100%" height="100%" style="padding:5px;">
    `;
    alertify.modalEstandarProducto(html).setHeader(title);
  }

  cargarModalCategoria(item: any) {
    this.item_tipo = item;
    const tituloTipo = `/Tipo ${this.item_tipo.nombre}`;
    const title = tituloTipo.toUpperCase();
    const idEl = 'id_items_categorias';
    const html = `<div class="modal-body">
                    <div id="${idEl}" class="col-sm-12 row"></div>
                  </div>`;
    alertify.modalEstandarCategoria(html).setHeader(title);
    this.cargarCategoria(idEl, item.id);
  }

  cargarModalProductos(item: any) {
    this.item_categoria = item;
    const tituloTipo = `/Tipo ${this.item_tipo.nombre}`;
    const tituloCategoria = `/Categoria ${this.item_categoria.nombre}`;
    const title = (tituloTipo + tituloCategoria).toUpperCase();
    const idEl = 'id_items_productos';
    const html = `<div class="modal-body">
                    <div id="${idEl}" class="col-sm-12 row"></div>
                  </div>`;
    alertify.modalEstandarProducto(html).setHeader(title);
    this.cargarProductosCategoria(idEl, item.id, null);
  }

  static lstCatalogoVenta: Array<ItemsCatalogo> = [];
  async cargarModalVisualizarProducto(item: any) {
    this.isLoading = true;
    this.item_producto = item;
    this.data_categorias = [];
    const endPoint = 'dasboard/producto/show';
    const id_producto = item.id;
    const res: any = await GlobalService.Post(endPoint, { id_producto });
    if (res.status === 200) {
      const item_producto: ItemProducto = res.data;
      let tituloTipo = `/Tipo ${item_producto.tipo_nombre}`;
      let tituloCategoria = `/Categoria ${item_producto.categoria_nombre}`;
      let title = tituloTipo + tituloCategoria;
      if (item.titulo) {
        title += `/${item.titulo}`;
      }
      title = title.toUpperCase();
      let html = null;

      switch (item_producto.tipo_codigo) {
        case Constantes.tipo.servicio:
          html = await this.plantillaServicios(item_producto);
          break;
        case Constantes.tipo.recarga:
          html = await this.plantillaRecargas(item_producto);
          break;
        case Constantes.tipo.digital:
          const endPointDigital = 'general/private/digital/catalogo';
          const resDigital: any = await GlobalService.Post(endPointDigital, { id_producto });
          if (resDigital.status === 200) {
            HomeComponent.lstCatalogoVenta = resDigital.data;
            html = await this.plantillaDigitales(item_producto);
          }
          break;
        default:
          UtilitariosService.Alertify_alert({
            mensaje: 'Actualmente, no se dispone de una interfaz gráfica para procesar este producto o servicio.',
            type: 'warning'
          });
          break;
      }

      if (html) {
        alertify.modalEstandarVenta(html).setHeader(title);
        const buscarProducto = () => this.cargarInfoProducto(item_producto);
        const bloquearReferencia = (e: any) => this.bloquearReferencia(e, item_producto);
        const renderBotonPagar = this.renderBotonPagar.bind(this);

        await this.verificarCupo();
        setTimeout(() => {
          const elBtnPagar = document.getElementById('id_bnt_pagar');
          if (elBtnPagar) {
            elBtnPagar.innerHTML = renderBotonPagar(0, item_producto);
          }

          const elBtnBuscarProducto = document.getElementById('id_btn_buscar_producto');
          if (elBtnBuscarProducto) {
            elBtnBuscarProducto.addEventListener('click', buscarProducto);
          }

          const elInputReferencia = document.getElementById('id_in_referencia');
          if (elInputReferencia) {
            elInputReferencia.addEventListener('keydown', bloquearReferencia);
            elInputReferencia.addEventListener('keypress', (event: KeyboardEvent) => {
              if (event.key === 'Enter') {
                buscarProducto();
              }
            });
          }

          this.renderFuncionesRubros(item_producto);

          const radioButtons = document.querySelectorAll('input[name="rb_catalogo"]');
          if (radioButtons) {
            const dataCatalogo: any = HomeComponent.lstCatalogoVenta;
            radioButtons.forEach((radioButton: any) => {
              radioButton.addEventListener('change', (e: any) => {
                const idCatalogo = e.currentTarget.value || 0;
                const itemCatalogo: ItemsCatalogo = dataCatalogo.find((catalogo: ItemsCatalogo) => catalogo.id_catalogo == idCatalogo);
                const precio = itemCatalogo?.precio || 0;
                this.itemConsultaServicio.Identificador = idCatalogo;
                $('#id_bnt_pagar').html(renderBotonPagar(precio, item_producto));
              });
            });
          }
        }, 50);
      }
    }
    this.isLoading = false;
    UtilitariosService.loadingElementOff('idHtml');
  }

  private getDataFormulario() {
    let valido = true;
    const dataValueForms: any = [];
    const dataForms: any = HomeComponent.formsInfoDigital;
    for (const el of dataForms) {
      const id = el.id;
      const elemento = $(`#info_${id}`);
      const value = elemento.val();
      const required = el.required;
      elemento.removeClass('is-invalid').removeClass('is-valid');

      if (!value && required) {
        elemento.addClass('is-invalid');
        valido = false;
      } else if (value) {
        elemento.addClass('is-valid');
        dataValueForms.push({ id, value });
      }
    }
    this.itemConsultaServicio.Forms = dataValueForms;
    return valido;
  }

  async plantillaServicios(item_producto: ItemProducto) {
    const html_body = `
      <div class="row">
        <div class="input-group col-sm-4 col-xs-12" style="margin-bottom: 5px;">
          <div class="input-group-prepend">
            <span class="input-group-text"><i class="fa fa-list-alt"></i></span>
          </div>
          <input type="text" class="form-control" id="id_info_pro_Identificador" placeholder="Identificación" style="height: 2em; font-size: 2em;" disabled>
        </div>
        <div class="input-group col-sm-8 col-xs-12" style="margin-bottom: 5px;">
          <div class="input-group-prepend">
            <span class="input-group-text"><i class="fa fa-user"></i></span>
          </div>
          <input type="text" class="form-control" id="id_info_pro_nombre" placeholder="Nombres" style="height: 2em; font-size: 2em;" disabled>
        </div>
      </div>
      <div>
        <table id="id_table_rubros" class="display table table-bordered table-striped dataTable dtr-inline" width="100%">
          <thead></thead>
          <tfoot align="right">
            <tr>
              <th colspan="3" style="text-align:right">Resumen de pago:</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    `;

    return `
      <div>
        <div class="info-box bg-info" style="border-radius: 0;">
          <span>
            <img class="elevation-2" src="${item_producto.icono}" alt="${item_producto.nombre}" style="width: 120px; height: 120px; padding: 5px;">
          </span>
          <div class="info-box-content">
            <h3>${item_producto.nombre}</h3>
            <div class="input-group input-group-lg mb-12">
              <div class="input-group-prepend">
                <button id="id_btn_buscar_producto" type="button" class="btn btn-warning">Buscar</button>
              </div>
              <input id="id_in_referencia" type="text" class="form-control" min="1" max="${item_producto.referencia_longitud}" placeholder="${item_producto.referencia_titulo}">
            </div>
          </div>
        </div>
        <div class="modal-body" style="padding-bottom: 5px; padding-top: 5px;">
          ${html_body}
        </div>
      </div>
    `;
  }

  async plantillaRecargas(item_producto: ItemProducto) {
    const html_body = `
      <div class="row">
        <div class="input-group col-sm-10 col-xs-12" style="margin-bottom: 5px;">
          <div class="input-group-prepend" title="${item_producto.referencia_titulo}">
            <span class="input-group-text"><i class="fa fa-list-alt"></i></span>
          </div>
          <input id="id_in_referencia" type="number" class="form-control" placeholder="${item_producto.referencia_titulo}" style="height: 2em; font-size: 9em;">
        </div>
        <div class="input-group col-sm-2 col-xs-12" style="align-content: center;">
          <div class="rows">
            <div class="input-group col-sm-12 col-xs-12">
              <div class="input-group-prepend" title="CANTIDAD DE RECARGA">
                <span class="input-group-text"><i class="fa fa-edit"></i></span>
              </div>
              <input id="id_info_pro_cantidad" type="number" class="form-control" placeholder="#" min="1" max="30" style="height: 2em; font-size: 6em;" disabled>
            </div>
            <hr>
            <div class="input-group col-sm-12 col-xs-12" style="justify-content: center;">
              <div id="id_bnt_pagar"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    return `
      <div>
        <div class="info-box bg-info" style="border-radius: 0;">
          <span>
            <img class="elevation-2" src="${item_producto.icono}" alt="${item_producto.nombre}" style="width: 120px; height: 120px; padding: 5px;">
          </span>
          <div class="info-box-content">
            <h3>${item_producto.nombre}</h3>
          </div>
        </div>
        <div class="modal-body" style="padding-bottom: 5px; padding-top: 5px;">
          ${html_body}
        </div>
      </div>
    `;
  }

  static formsInfoDigital = [
    { id: 'telefono', name: 'Telefono', type: 'text', required: true },
    { id: 'dni', name: 'DNI', type: 'text', required: false },
    { id: 'correo', name: 'Correo', type: 'email', required: false }
  ];

  async plantillaDigitales(item_producto: ItemProducto) {
    const dataCatalogo = HomeComponent.lstCatalogoVenta;
    let htmlTabla = '';
    for (const el of dataCatalogo) {
      htmlTabla += `
        <tr>
          <td>$${el.precio}</td>
          <td>${el.descripcion}</td>
          <td>
            <div class="icheck-success d-inline">
              <input type="radio" name="rb_catalogo" id="radcat${el.id_catalogo}" value="${el.id_catalogo}">
              <label for="radcat${el.id_catalogo}"></label>
            </div>
          </td>
        </tr>
      `;
    }

    const dataForms = HomeComponent.formsInfoDigital;
    let htmlForms = '';
    for (const el of dataForms) {
      const requerido = el.required ? '*' : '';
      const name = requerido + el.name;
      const id = `info_${el.id}`;
      htmlForms += `
        <div class="form-group">
          <label class="col-form-label" for="${id}">${name}</label>
          <input type="${el.type}" class="form-control" id="${id}" placeholder="Enter ...">
        </div>
      `;
    }

    const html_body = `
      <div class="row">
        <div class="col-md-7">
          <div class="card card-warning">
            <div class="card-header">
              <h3 class="card-title">Catalogo de productos</h3>
            </div>
            <div class="card-body table-responsive p-0" style="height: 230px;">
              <table class="table table-head-fixed text-nowrap">
                <thead>
                  <tr>
                    <th>Precio</th>
                    <th>Descripcion</th>
                    <th>Marcar</th>
                  </tr>
                </thead>
                <tbody>
                  ${htmlTabla}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-md-5">
          <div class="card card-warning">
            <div class="card-header">
              <h3 class="card-title">Informacion</h3>
            </div>
            <div class="card-body table-responsive" style="height: 180px;">
              ${htmlForms}
            </div>
          </div>
          <div class="input-group col-sm-12 col-xs-12" style="justify-content: center;">
            <div id="id_bnt_pagar"></div>
          </div>
        </div>
      </div>
    `;

    return `
      <div>
        <div class="info-box bg-info" style="border-radius: 0;">
          <span>
            <img class="elevation-2" src="${item_producto.icono}" alt="${item_producto.nombre}" style="width: 120px; height: 120px; padding: 5px;">
          </span>
          <div class="info-box-content">
            <h3>${item_producto.nombre}</h3>
          </div>
        </div>
        <div class="modal-body" style="padding-bottom: 5px; padding-top: 5px;">
          ${html_body}
        </div>
      </div>
    `;
  }

  async renderFuncionesRubros(item_producto: ItemProducto) {
    const elTablaRubros: any = $('#id_table_rubros');
    if (elTablaRubros) {
      const botonPagar = (sumaTotal: any) => this.renderBotonPagar(sumaTotal, item_producto);

      const render_valor = (val: any, type: any, row: DetallesRubros) => `
        <div class="d-inline">
          <input type="number" class="dt-control-value" id="id_valor_${row.IdRubro}" value="${val}">
        </div>
      `;

      const render_rubro = (val: any, type: any, row: DetallesRubros) => {
        const checked = row.SePaga ? 'checked' : '';
        return `
          <div class="icheck-success d-inline">
            <input type="checkbox" class="dt-control-status-checkbox" id="id_is_pago_${row.IdRubro}" ${checked}>
            <label for="id_is_pago_${row.IdRubro}"></label>
          </div>
        `;
      };

      this.dataTablaRubros = elTablaRubros.DataTable({
        autoWidth: true,
        responsive: true,
        processing: true,
        paging: false,
        lengthChange: false,
        searching: false,
        ordering: false,
        info: false,
        columns: [
          { title: 'IdRubro', data: 'IdRubro', visible: false },
          { title: 'Prioridad', data: 'Prioridad', width: '10%', className: 'text-center', visible: false },
          { title: 'Descripcion', data: 'Descripcion', className: 'text-left' },
          { title: 'Valor', data: 'Valor', width: '10%', className: 'text-right', render: render_valor },
          { title: 'Comision', data: 'Comision', width: '10%', className: 'text-right' },
          { title: 'Total', data: 'ValorConComision', width: '10%', className: 'text-right' },
          { title: 'Rubro', data: 'SePaga', width: '10%', className: 'text-center', render: render_rubro }
        ],
        scrollY: 110,
        scrollX: true,
        order: [[1, 'asc']],
        footerCallback: function (row: any, data: Array<DetallesRubros>) {
          let api = this.api();
          let sumaValor = 0;
          let sumaComision = 0;
          let sumaTotal = 0;

          for (const el of data) {
            if (el.SePaga) {
              sumaValor += el.Valor;
              sumaComision += el.Comision;
              sumaTotal += el.ValorConComision;
            }
          }

          $(api.column(3).footer()).html(`$${sumaValor.toFixed(2)}`);
          $(api.column(4).footer()).html(`$${sumaComision.toFixed(2)}`);
          $(api.column(5).footer()).html(`$${sumaTotal.toFixed(2)}`);
          $(api.column(6).footer()).html(botonPagar(sumaTotal));
        }
      });

      this.dataTablaRubros.on('change', '.dt-control-value', (e: any) => {
        const valor = parseFloat(e.currentTarget.value);
        const tr = e.currentTarget.closest('tr');
        const row = this.dataTablaRubros.row(tr);
        const valorConComision = row.data().Comision + valor;
        const valorFijo = row.data().ValorFijo;
        const tipoPago = item_producto.tipo_pago;

        if (valor <= 0) {
          UtilitariosService.Alertify_alert({ mensaje: `El monto a abonar no puede ser menor a ${valorFijo}`, type: 'warning' });
          row.data().Valor = valorFijo;
        } else if (valor > valorFijo) {
          UtilitariosService.Alertify_alert({ mensaje: `El monto a abonar no puede ser mayor a ${valorFijo}`, type: 'warning' });
          row.data().Valor = valorFijo;
        } else {
          row.data().Valor = valor;
          row.data().ValorConComision = valorConComision;
        }

        const datas: Array<DetallesRubros> = this.dataTablaRubros.data();
        this.dataTablaRubros.clear().rows.add(datas).draw();
      });

      this.dataTablaRubros.on('change', '.dt-control-status-checkbox', (e: any) => {
        const SePaga = e.currentTarget.checked;
        const tr = e.currentTarget.closest('tr');
        const row = this.dataTablaRubros.row(tr);
        row.data().SePaga = SePaga;

        const datas: Array<DetallesRubros> = this.dataTablaRubros.data();
        this.dataTablaRubros.clear().rows.add(datas).draw();
      });
    }
  }

  renderBotonPagar(sumaTotal: number, item_producto: ItemProducto) {
    const realizarTipoPago = (idTipoPago: number) => this.realizarPago(idTipoPago, item_producto);
    let html = `
      <div class="input-group-prepend show">
        <button [disabled] type="button" class="btn btn-block btn-lg dropdown-toggle [estilo]" data-toggle="dropdown" aria-expanded="false">
          PAGAR CON
        </button>
        <div class="dropdown-menu">
          <a class="dropdown-item id_btn_pago_saldo">Saldo $${this.data_cupo.total_saldo}</a>
          <a class="dropdown-item id_btn_pago_ganancia">Ganancia $${this.data_cupo.total_comision}</a>
        </div>
      </div>
    `;
    if (sumaTotal === 0) {
      html = UtilitariosService.replaceText(html, '[estilo]', 'btn-danger');
      html = UtilitariosService.replaceText(html, '[disabled]', 'disabled="disabled"');
    } else {
      html = UtilitariosService.replaceText(html, '[estilo]', 'btn-primary');
      html = UtilitariosService.replaceText(html, '[disabled]', '');
    }

    setTimeout(() => {
      $('.id_btn_pago_saldo').click(() => realizarTipoPago(1));
      $('.id_btn_pago_ganancia').click(() => realizarTipoPago(2));
    }, 10);

    return html;
  }

  bloquearReferencia(event: any, item_producto: ItemProducto) {
    const inputField = event.target;
    const inputValue = inputField.value;
    const longitud = item_producto.referencia_longitud;
    if (inputValue.length >= longitud) {
      inputField.value = inputValue.slice(0, longitud);
    }
  }

  async cargarInfoProducto(item_producto: ItemProducto) {
    this.isLoading = true;
    const IdProducto = item_producto.id;
    const IdentidadProducto = item_producto.identidad;
    const Referencia = $('#id_in_referencia').val();
    const valido = this.validarInputReferencia(item_producto, Referencia);
    this.itemConsultaServicio = new ItemConsultaServicio();
    if (valido) {
      switch (item_producto.tipo_codigo) {
        case Constantes.tipo.servicio:
          const endPoint = 'red_facilito/consulta';
          const res: any = await GlobalService.Post(endPoint, { IdProducto, IdentidadProducto, Referencia });
          if (res.status === 200) {
            this.itemConsultaServicio = res.data;
          }
          break;
        case Constantes.tipo.recarga:
          const elProCantidad = document.getElementById('id_info_pro_cantidad') as HTMLInputElement;
          let Cantidad = elProCantidad?.value || '0';
          Cantidad = Cantidad === '0' ? '1' : Cantidad;
          this.itemConsultaServicio.Identificador = Referencia;
          this.itemConsultaServicio.RecargarCantidad = parseInt(Cantidad);
          this.itemConsultaServicio.RecargarEdit = false;
          break;
        case Constantes.tipo.digital:
          alert('cargarInfoProducto no implementado para digital');
          break;
        default:
          UtilitariosService.Alertify_alert({
            mensaje: 'Actualmente, no se dispone de una interfaz gráfica para procesar este producto o servicio.',
            type: 'warning'
          });
          break;
      }
    }
    this.setValuesServicio(this.itemConsultaServicio, item_producto);
    this.isLoading = false;
    UtilitariosService.loadingElementOff('idHtml');
  }

  async setValuesServicio(data: ItemConsultaServicio, item_producto: ItemProducto) {
    const elIdentificador = document.getElementById('id_info_pro_Identificador') as HTMLInputElement;
    const elNombre = document.getElementById('id_info_pro_nombre') as HTMLInputElement;
    const elCantidad = document.getElementById('id_info_pro_cantidad') as HTMLInputElement;

    if (elIdentificador) {
      elIdentificador.value = data.Identificador || '';
    }

    if (elNombre) {
      elNombre.value = data.Nombre || '';
    }

    if (elCantidad) {
      elCantidad.disabled = data.RecargarEdit || false;
      elCantidad.value = data.RecargarCantidad?.toString() || '';
      $('#id_bnt_pagar').html(this.renderBotonPagar(data.RecargarCantidad || 0, item_producto));
    }

    if (this.dataTablaRubros && data.DetallesRubros) {
      if (this.dataTablaRubros.data().any()) {
        this.dataTablaRubros.clear();
      }
      this.dataTablaRubros.rows.add(data.DetallesRubros).draw();
    }
  }

  validarInputReferencia(item_producto: ItemProducto, referencia: string) {
    const elemento_referencia = $('#id_in_referencia');
    elemento_referencia.removeClass('is-invalid').removeClass('is-valid');
    let result = false;
    let msj = '';
    const tamanio = referencia.length;
    const ref_titulo = item_producto.referencia_titulo;
    const ref_tipo = item_producto.referencia_tipo_dato;
    const ref_longitud = item_producto.referencia_longitud;

    const isRecarga = item_producto.tipo_codigo === '002';
    const valido = isRecarga ? ref_longitud === tamanio : ref_longitud >= tamanio;

    if (valido) {
      result = true;
      switch (ref_tipo) {
        case 'NUM':
          result = UtilitariosService.validarSoloNumeros(referencia);
          msj = 'Se requieren solo números';
          break;
        case 'TEXT':
          result = UtilitariosService.validarSoloTexto(referencia);
          msj = 'Se requieren solo texto';
          break;
        case 'ALF':
          result = UtilitariosService.validarSoloAlfaNumerico(referencia);
          msj = 'Se requieren solo texto y números';
          break;
      }
    } else {
      msj = `El valor máximo de referencia es de ${ref_longitud} caracteres.`;
    }

    if (!result) {
      UtilitariosService.Alertify_alert({ mensaje: msj, type: 'warning' });
      const data: ItemConsultaServicio = new ItemConsultaServicio();
      this.setValuesServicio(data, item_producto);
      elemento_referencia.addClass('is-invalid');
    } else {
      elemento_referencia.addClass('is-valid');
    }
    return result;
  }

  async realizarPago(IdTipoPago: number, item_producto: ItemProducto) {
    this.isLoading = true;
    const DatosFactura = '1315463776|Jefferson Carrillo|0988633265|jaccarrillo@outlook.es|Manta';
    const IdProducto = item_producto.id;
    const IdentidadProducto = item_producto.identidad;
    const Referencia = this.itemConsultaServicio.Identificador;
    let res: any = {};
    let endPoint = '';

    switch (item_producto.tipo_codigo) {
      case Constantes.tipo.servicio:
        const IdTransaccion = this.itemConsultaServicio.IdTransaccion;
        const Nombre = this.itemConsultaServicio.Nombre;
        const DetallesRubros: Array<DetallesRubros> = [];
        const datas: Array<DetallesRubros> = this.dataTablaRubros?.data() || [];
        for (const el of datas) {
          if (el.SePaga) {
            DetallesRubros.push(el);
          }
        }

        if (DetallesRubros.length === 0) {
          UtilitariosService.Alertify_alert({ mensaje: 'No se ha seleccionado ningún rubro.', type: 'warning' });
        } else {
          endPoint = 'red_facilito/pago';
          res = await GlobalService.Post(endPoint, { DatosFactura, IdTipoPago, IdProducto, IdentidadProducto, Referencia, Nombre, IdTransaccion, DetallesRubros });
        }
        break;
      case Constantes.tipo.recarga:
        endPoint = 'red_facilito/recargar';
        const Cantidad = this.itemConsultaServicio.RecargarCantidad;
        res = await GlobalService.Post(endPoint, { DatosFactura, IdTipoPago, IdProducto, IdentidadProducto, Referencia, Cantidad });
        break;
      case Constantes.tipo.digital:
        const valido = this.getDataFormulario();
        if (valido) {
          endPoint = 'red_facilito/contratar';
          const Forms = this.itemConsultaServicio.Forms;
          res = await GlobalService.Post(endPoint, { DatosFactura, IdTipoPago, IdProducto, IdentidadProducto, Referencia, Forms });
        } else {
          UtilitariosService.Alertify_alert({ mensaje: 'Verificar información de datos requeridos.', type: 'warning' });
        }
        break;
      default:
        UtilitariosService.Alertify_alert({
          mensaje: 'Actualmente, no se dispone de una interfaz gráfica para procesar este producto o servicio.',
          type: 'warning'
        });
        break;
    }

    if (res.status === 200) {
      const titulo = ' COMPROBANTE';
      this.dataPagoRealizado = res.data;
      const HTMLRecibo = this.dataPagoRealizado.HTMLRecibo;
      const icono = 'fa fa-file-text-o';
      const html = `
        <div class="col-12">
          <div id="id_cont_comprobante" class="modal-body" style="padding-bottom: 5px; padding-top: 5px;">
            <style>
              .font {
                margin-top: 5px;
                margin-bottom: 5px;
                font-family: monospace;
              }
            </style>
            ${HTMLRecibo}
          </div>
        </div>
      `;
      alertify.modalComprobante(html).setHeader(`<i class="${icono}"></i>${titulo}`).closeOthers();
    }
    this.isLoading = false;
    UtilitariosService.loadingElementOff('idHtml');
  }

  renderCardItem(data: ItemCard) {
    return `
      <div id="${data.key}" class="col-sm-3">
        <div class="info-box ${data.background} cursor_selector_pro">
          <span>
            <img class="elevation-2" src="${data.icono}" alt="${data.nombre}" style="width: 60px; height: 60px; padding: 5px;">
          </span>
          <div class="info-box-content">
            ${data.nombre}
          </div>
        </div>
      </div>
    `;
  }

  trackById(index: number, item: ItemCard): string {
    return item.id;
  }

  customerLine(text: string, limit: number): string {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  shareOnWhatsApp(imagen: string) {
    const text = '¡Mira esta imagen increíble!';
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}&image=${encodeURIComponent(imagen)}`;
    window.open(shareUrl, '_blank');
  }
}