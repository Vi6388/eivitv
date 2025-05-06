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
  selector: 'app-dasboard',
  templateUrl: './dasboard.component.html',
  styleUrls: ['./dasboard.component.css']
})
export class DasboardComponent implements OnInit, AfterViewInit {

  constructor() { }

  public data_publicidad: any = [];
  public data_tipos: any = [];
  public data_servicios_ciudad: any = [];
  public data_producto_favoritos: any = [];
  public data_categorias: any = [];
  public data_productos: any = [];
  public item_tipo!: ItemsBox;
  public item_categoria!: ItemsBox;
  public item_producto!: ItemsBox;
  public dataUsuario: usuarioModel = UtilitariosService.getDataUsuario();
  public dataPagoRealizado: PagoRealizado = new PagoRealizado();
  public itemConsultaServicio: ItemConsultaServicio = new ItemConsultaServicio();
  static i: any;
  public dataTablaRubros: any = null;
  public data_cupo: VerificarCupo = new VerificarCupo;

  public dataInit: any = {
    tituloServiciosCiudad: "En la ciudad de " + this.dataUsuario.canton,
    tituloFavoritos: 'Favoritos',
    tituloTipo: 'Tipo de servicios',
    tituloPublicidad: 'Publicidades'
  }

  ngOnInit(): void {
    UtilitariosService.loadingOn();
    UtilitariosService.getVericarSession();
    this.initPublicidades();
    this.initServiciosCiudad();
    this.initFavoritos();
    this.initTipos();
    DasboardComponent.i = this;
    UtilitariosService.loadingOff();
  }

  ngAfterViewInit(): void {
    UtilitariosService.configurarTab();
  }

  //inicializar box
  async initServiciosCiudad() {
    let canton = this.dataUsuario.canton;
    this.data_servicios_ciudad = [];
    let endPoint = "dasboard/producto/list";
    let res: any = await GlobalService.Post(endPoint, { canton });
    if (res.status == 200) {
      this.data_servicios_ciudad = res.data;
      UtilitariosService.cargarSlider('id_slider_servicios_ciudad', {
        dots: false,
        lazyLoad: 'ondemand',
        infinite: true,
        centerMode: true,
        letiableWidth: true,
        //  slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000,
        variableWidth: true,
        adaptiveHeight: true,
      });
    }
  }

  async initFavoritos() {
    let id_usuario = this.dataUsuario.id;
    let endPoint = "dasboard/favorito/list";
    let res: any = await GlobalService.Post(endPoint, {});
    if (res.status == 200) {
      this.data_producto_favoritos = res.data;
      UtilitariosService.cargarSlider('id_slider_favoritos', {
        dots: false,
        lazyLoad: 'ondemand',
        infinite: true,
        centerMode: true,
        letiableWidth: true,
        //  slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000,
        variableWidth: true,
        adaptiveHeight: true,
      });
    }
  }

  async initTipos() {
    this.data_tipos = [];
    let endPoint = "dasboard/tipo/list";
    let res: any = await GlobalService.Post(endPoint, {});
    if (res.status == 200) {
      this.data_tipos = res.data;
      UtilitariosService.cargarSlider('id_slider_tipos',
        {
          dots: false,
          lazyLoad: 'ondemand',
          infinite: false,
          centerMode: true,
          letiableWidth: true,
          //  slidesToShow: 3,
          slidesToScroll: 1,
          autoplay: false,
          autoplaySpeed: 6000,
          variableWidth: true,
          adaptiveHeight: true,
        });
    }
  }

  async initPublicidades() {
    this.data_publicidad = [];
    let endPoint = "dasboard/publicidad/list";
    let res: any = await GlobalService.Post(endPoint, {});
    if (res.status == 200) {
      this.data_publicidad = res.data;
      UtilitariosService.cargarSlider('id_slider_publicidad',
        {
          dots: false,
          lazyLoad: 'ondemand',
          infinite: false,
          centerMode: true,
          letiableWidth: true,
          //  slidesToShow: 3,
          slidesToScroll: 1,
          autoplay: false,
          autoplaySpeed: 6000,
          variableWidth: true,
          adaptiveHeight: true,
        });
    }
  }

  //generar consultas a para cargar datos en box

  public async verificarCupo() {
    let endPoint = "saldos/visualizar/cupos";
    let res: any = await GlobalService.Post(endPoint, {});
    if (res.status == 200) {
      this.data_cupo = res.data;
    }
  }



  async cargarCategoria(idEl: string, id_tipo: string) {
    UtilitariosService.loadingElementOn('idHtml');
    this.data_categorias = [];
    let endPoint = "dasboard/categoria/list";
    let res: any = await GlobalService.Post(endPoint, { id_tipo });
    if (res.status == 200) {
      this.data_categorias = res.data;
      $("#" + idEl).empty();
      for (let index = 0; index < this.data_categorias.length; index++) {
        let item = this.data_categorias[index];
        let html = this.renderCardItem({ ...item, key: idEl + item.id, background: 'bg-info' });
        $("#" + idEl).append(html);
        let cargarModal = function () { DasboardComponent.i.cargarModalProductos(item) }
        document.getElementById(idEl + item.id).addEventListener("click", cargarModal);
      }
    }
    UtilitariosService.loadingElementOff('idHtml');
  }

  async cargarProductosCategoria(idEl: string, id_categoria: any, nombre: any) {
    UtilitariosService.loadingElementOn('idHtml');
    this.data_productos = [];
    let endPoint = "dasboard/producto/list";
    let res: any = await GlobalService.Post(endPoint, { id_categoria, nombre });
    if (res.status == 200) {
      this.data_productos = res.data;
      $("#" + idEl).empty();
      for (let index = 0; index < this.data_productos.length; index++) {
        let item = this.data_productos[index];
        let html = this.renderCardItem({ ...item, key: idEl + item.id, background: 'bg-primary' });
        $("#" + idEl).append(html);
        item.titulo = "";
        let cargarModal = function () { DasboardComponent.i.cargarModalVisualizarProducto(item) }
        document.getElementById(idEl + item.id).addEventListener("click", cargarModal);
      }
    }
    UtilitariosService.loadingElementOff('idHtml');
  }

  //habilita o inhablita  box
  public showServiciosCiudad(item: any) {
    $(".ms-box-focus").removeClass("ms-box-focus-active");
    $("#id_servicios_ciudad_" + item.id).addClass("ms-box-focus-active");
    item.titulo = this.dataInit.tituloServiciosCiudad;
    this.cargarModalVisualizarProducto(item);
  }

  public showProductosFavorito(item: any) {
    $(".ms-box-focus").removeClass("ms-box-focus-active");
    $("#id_producto_favorito_" + item.id).addClass("ms-box-focus-active");
    item.titulo = this.dataInit.tituloFavoritos;
    this.cargarModalVisualizarProducto(item);
  }

  public showCategoria(item: any) {
    $(".ms-box-focus").removeClass("ms-box-focus-active");
    $("#id_tipo_producto_" + item.id).addClass("ms-box-focus-active");
    item.titulo = this.dataInit.tituloTipo;
    this.cargarModalCategoria(item);
  }

  public showPublicidad(item: any) {
    $(".ms-box-focus").removeClass("ms-box-focus-active");
    $("#id_publicidad_" + item.id).addClass("ms-box-focus-active");
    item.titulo = this.dataInit.tituloPublicidad;
    this.cargarModalPublicidad(item);
  }

  //cargar datos en modal html
  public cargarModalPublicidad(item: any) {
    let title = item.titulo;
    title = title.toUpperCase();
    let html = `
                    <img class="elevation-2" src="${item.imagen}" alt="${item.nombre}"  width="100%"  height="100%" style="padding:5px;"> 
                  
                `  ;

    alertify.modalEstandarProducto(html).setHeader(title);
  }


  public cargarModalCategoria(item: any) {
    this.item_tipo = item;
    let tituloTipo = "/Tipo " + this.item_tipo.nombre;
    let title = tituloTipo;
    title = title.toUpperCase();
    let idEl = "id_items_categorias";
    let html = `<div class="modal-body">
                  <div id="${idEl}" class="col-sm-12 row">  
                  </div>              
                </div>
                `  ;
    alertify.modalEstandarCategoria(html).setHeader(title);
    this.cargarCategoria(idEl, item.id);
  }

  public cargarModalProductos(item: any) {
    this.item_categoria = item;
    let tituloTipo = "/Tipo " + this.item_tipo.nombre;
    let tituloCategoria = " /Categoria " + this.item_categoria.nombre;
    let title = tituloTipo + tituloCategoria;
    title = title.toUpperCase();
    let idEl = "id_items_productos";
    let html = `<div class="modal-body">
                  <div id="${idEl}" class="col-sm-12 row">   
                  </div>              
                </div>
                `  ;

    alertify.modalEstandarProducto(html).setHeader(title);
    this.cargarProductosCategoria(idEl, item.id, null);

  }

  public static lstCatalogoVenta: Array<ItemsCatalogo> = [];
  public async cargarModalVisualizarProducto(item: any) {
    UtilitariosService.loadingElementOn('idHtml');
    this.item_producto = item;
    this.data_categorias = [];
    let endPoint = "dasboard/producto/show";
    let id_producto = item.id;
    let res: any = await GlobalService.Post(endPoint, { id_producto });
    if (res.status == 200) {
      let item_producto: ItemProducto = res.data;
      let tituloTipo = "/Tipo " + item_producto.tipo_nombre;
      let tituloCategoria = " /Categoria " + item_producto.categoria_nombre;
      let title = tituloTipo + tituloCategoria;
      if (item.titulo) { title = title + " /" + item.titulo; }
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
          let endPoint = "general/private/digital/catalogo";
          let id_producto = item_producto.id;
          let res: any = await GlobalService.Post(endPoint, { id_producto });
          if (res.status == 200) {
            DasboardComponent.lstCatalogoVenta = res.data;
            html = await this.plantillaDigitales(item_producto);
          }

          break;
        default:
          UtilitariosService.Alertify_alert({ mensaje: "Actualmente, no se dispone de una interfaz gráfica para procesar este producto o servicio.", type: "warning" });
          break;
      }

      if (html) {
        //renderizar plantilla en componete alertify
        alertify.modalEstandarVenta(html).setHeader(title);


        let buscarProducto = function () { DasboardComponent.i.cargarInfoProducto(item_producto) }
        let bloquearReferencia = function (e: any) { DasboardComponent.i.bloquearReferencia(e, item_producto) };
        let renderBotonPagar = this.renderBotonPagar;

        await this.verificarCupo();
        setTimeout(() => {

          //si tiene input de buscar producto habilitar boton
          let elBtnPagar = document.getElementById("id_bnt_pagar");
          if (elBtnPagar) {
            elBtnPagar.innerHTML = renderBotonPagar(0, item_producto);
          }



          //si tiene input de buscar producto habilitar boton
          let elBtnBuscarProducto = document.getElementById("id_btn_buscar_producto");
          if (elBtnBuscarProducto) {
            elBtnBuscarProducto.addEventListener("click", buscarProducto);
          }


          // si tiene input para referencua habilitar boton
          let elInputReferencia = document.getElementById("id_in_referencia");
          if (elInputReferencia) {
            elInputReferencia.addEventListener("keydown", bloquearReferencia);
            elInputReferencia.addEventListener("keypress", (event: KeyboardEvent) => {
              if (event.keyCode === 13) {
                buscarProducto();
              }
            });

          }

          this.renderFuncionesRubros(item_producto);

          //digitales
          var radioButtons = document.querySelectorAll('input[name="rb_catalogo"]');
          if (radioButtons) {
            let dataCatalogo: any = DasboardComponent.lstCatalogoVenta;
            // Agregar el evento change a cada radio button
            radioButtons.forEach((radioButton: any) => {
              radioButton.addEventListener('change', (e: any) => {
                let idCatalogo = e.currentTarget.value || 0;
                let itemCatalogo: ItemsCatalogo = dataCatalogo.find(function (catalogo: ItemsCatalogo) {
                  return catalogo.id_catalogo == idCatalogo;
                });
                let precio = itemCatalogo.precio || 0;
                this.itemConsultaServicio.Identificador = idCatalogo;
                $("#id_bnt_pagar").html(renderBotonPagar(precio, item_producto));

              });
            });
          }




        }, 50);
      }

    }
    UtilitariosService.loadingElementOff('idHtml');
  }


  private getDataFormulario() {
    //formulario 
    let valido = true;
    let dataValueForms: any = [];
    let dataForms: any = DasboardComponent.formsInfoDigital;
    for (let index = 0; index < dataForms.length; index++) {
      const el = dataForms[index];
      let id = el.id;
      let elemento = $("#info_" + id);
      let value = elemento.val();
      let required = el.required;
      elemento.removeClass("is-invalid");
      elemento.removeClass("is-valid");

      if (value == "") {
        if (required) {
          elemento.addClass("is-invalid");
          valido = false;
        }
      } else {
        elemento.addClass("is-valid");
        dataValueForms.push({ id, value });
      }

    }
    this.itemConsultaServicio.Forms = dataValueForms;
    return valido;
  }

  // plantillas de tipo producto
  public async plantillaServicios(item_producto: any) {

    let html_body =
      `            
    <div class="row">
        <div class="input-group col-sm-4 col-xs-12" style="margin-bottom: 5px;">
            <div class="input-group-prepend">
                <span class="input-group-text"><i class="fa fa-list-alt"></i></span>
            </div>
            <input  type="text" class="form-control" id="id_info_pro_Identificador" placeholder="Identificación" style="height: 2em;font-size: 2em;" disabled>
        </div>        
        <div class="input-group col-sm-8 col-xs-12" style="margin-bottom: 5px;">
            <div class="input-group-prepend">
                <span class="input-group-text"><i class="fa fa-user"></i></span>
            </div>
            <input  type="text" class="form-control" id="id_info_pro_nombre" placeholder="Nombres" style="height: 2em;font-size: 2em;" disabled>
        </div>                 
    </div>
    <div class="">
      <table id="id_table_rubros" class="display table table-bordered table-striped dataTable dtr-inline"  width="100%"> 
        <thead> 
        </thead>
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


    let html = `<div>
                  <div class="info-box bg-info" style="border-radius: 0; "> 
                          <span>
                              <img class="elevation-2" src="${item_producto.icono}" alt="${item_producto.nombre}"
                                  style=" width: 120px; height: 120px; padding: 5px; ">
                          </span>  
                          <div class="info-box-content">
                                <h3> ${item_producto.nombre} </h3> 
                                <div class="input-group input-group-lg mb-12">
                                  <div class="input-group-prepend">
                                      <button id="id_btn_buscar_producto" type="button" class="btn btn-warning ">
                                          Buscar
                                      </button>
                                  </div>
                  
                                  <input id="id_in_referencia" type="text" class="form-control"  min="1" max="${item_producto.referencia_longitud}"
                                      placeholder="${item_producto.referencia_titulo}">
                              </div> 
                          </div> 
                  </div>  
                  <div class="modal-body" style="  padding-bottom: 5px; padding-top: 5px;">         
                    ${html_body}
                  </div>
                </div> `;

    return html;
  }
  public async plantillaRecargas(item_producto: any) {

    let html_body =
      `            
      <div class="row">     
        <div class="input-group col-sm-10 col-xs-12" style="margin-bottom: 5px;">
            <div class="input-group-prepend"  title="${item_producto.referencia_titulo}">        
                <span class="input-group-text"><i class="fa fa-list-alt"></i></span>
            </div>
            <input  id="id_in_referencia"  type="number" class="form-control"  placeholder="${item_producto.referencia_titulo}"  style="height: 2em;font-size: 9em;" >
         </div> 

         <div class="input-group col-sm-2 col-xs-12" style="align-content: center;">
            <div class="rows">
                <div class="input-group col-sm-12 col-xs-12">
                  <div class="input-group-prepend" title="CANTIDAD DE RECARGA">              
                      <span class="input-group-text"><i class="fa fa-edit"></i></span>
                  </div>
                  <input id="id_info_pro_cantidad" type="number" class="form-control"  placeholder="#" min="1" max="30"  style="height: 2em;font-size: 6em;" disabled>
                </div>  
                <hr>  
                <div class="input-group col-sm-12 col-xs-12" style="justify-content: center;"> 
                    <div id="id_bnt_pagar"> </div>                  
                </div>  
            </div>  
        </div>                                                                                                                                    
      </div>
     
  `;


    let html = `<div>
                  <div class="info-box bg-info" style="border-radius: 0; "> 
                          <span>
                              <img class="elevation-2" src="${item_producto.icono}" alt="${item_producto.nombre}"
                                  style=" width: 120px; height: 120px; padding: 5px; ">
                          </span>  
                          <div class="info-box-content">
                                <h3> ${item_producto.nombre} </h3>                               
                              </div> 
                          </div> 
                  </div>  
                  <div class="modal-body" style="  padding-bottom: 5px; padding-top: 5px;">         
                    ${html_body}
                  </div>
                </div> `;


    return html;


  }
  public static formsInfoDigital = [
    { id: "telefono", name: "Telefono", type: "text", required: true },
    { id: "dni", name: "DNI", type: "text", required: false },
    { id: "correo", name: "Correo", type: "email", required: false }

  ]


  public async plantillaDigitales(item_producto: any) {

    let dataCatalogo: any = DasboardComponent.lstCatalogoVenta;
    let htmlTabla = "";
    for (let index = 0; index < dataCatalogo.length; index++) {
      const el = dataCatalogo[index];
      htmlTabla = htmlTabla +
        `<tr>  
            <td>$${el.precio}</td>
            <td>${el.descripcion}</td>
            <td>
            <div class="icheck-success d-inline">
              <input type="radio" name="rb_catalogo"  id="radcat${el.id_catalogo}" value="${el.id_catalogo}" >
              <label for="radcat${el.id_catalogo}">
              </label>
            </div>
          </td>
        </tr>` ;
    }


    let dataForms: any = DasboardComponent.formsInfoDigital;
    let htmlForms = "";
    for (let index = 0; index < dataForms.length; index++) {
      const el = dataForms[index];
      let requerido = el.required ? "*" : "";
      let name = requerido + el.name;
      let id = "info_" + el.id;
      htmlForms = htmlForms +
        `<div class="form-group">
              <label class="col-form-label" for="${id}">${name}</label>
              <input type="${el.type}" class="form-control " id="${id}" placeholder="Enter ...">
          </div>    
        ` ;
    }


    let html_body =
      `        
      <div class="row">
          <div class="col-md-7">
              <div class="card  card-warning">
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
                  <div class="card-body table-responsive " style="height: 180px;">                
                  ${htmlForms}    
                  </div>
              </div> 
              <div class="input-group col-sm-12 col-xs-12" style="justify-content: center;">
                  <div id="id_bnt_pagar"></div>
              </div> 

          </div>
      </div>
       
  `;


    let html = `<div>
                  <div class="info-box bg-info" style="border-radius: 0; "> 
                          <span>
                              <img class="elevation-2" src="${item_producto.icono}" alt="${item_producto.nombre}"
                                  style=" width: 120px; height: 120px; padding: 5px; ">
                          </span>  
                          <div class="info-box-content">
                                <h3> ${item_producto.nombre} </h3>                               
                              </div> 
                          </div> 
                  </div>  
                  <div class="modal-body" style="  padding-bottom: 5px; padding-top: 5px;">         
                    ${html_body}
                  </div>
                </div> `;


    return html;


  }

  // funciones de pantallas
  public async renderFuncionesRubros(item_producto: any) {
    let elTablaRubros: any = $("#id_table_rubros");
    if (elTablaRubros) {
      let botonPagar = function (sumaTotal: any) { return DasboardComponent.i.renderBotonPagar(sumaTotal, item_producto) };

      function render_valor(val: any, type: any, row: DetallesRubros, meta: any) {
        return `
              <div class="d-inline">
                <input type="number" class="dt-control-value"  id="id_valor_${row.IdRubro}" value="${val}"> 
              </div>
              `;
      }

      function render_rubro(val: any, type: any, row: DetallesRubros, meta: any) {
        let checked = row.SePaga ? "checked" : "";
        return `
            <div class="icheck-success d-inline">
              <input type="checkbox" class="dt-control-status-checkbox" id="id_is_pago_${row.IdRubro}" ${checked}>
              <label for="id_is_pago_${row.IdRubro}"> </label>
            </div>
            `;
      }

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
          { title: "IdRubro", data: "IdRubro", "visible": false },
          { title: "Prioridad", data: "Prioridad", width: "10%", className: 'text-center', "visible": false },
          { title: "Descripcion", data: "Descripcion", className: 'text-left' },
          { title: "Valor", data: "Valor", width: "10%", className: 'text-right', render: render_valor },
          { title: "Comision", data: "Comision", width: "10%", className: 'text-right' },
          { title: "Total", data: "ValorConComision", width: "10%", className: 'text-right' },
          { title: "Rubro", data: "SePaga", width: "10%", className: 'text-center', render: render_rubro },
        ],
        scrollY: 110,
        scrollX: true,
        order: [[1, 'asc']],

        footerCallback: function (row: any, data: Array<DetallesRubros>, start: any, end: any, display: any) {
          let api = this.api();
          let sumaValor: number = 0;
          let sumaComision: number = 0;
          let sumaTotal: number = 0;

          for (let index = 0; index < data.length; index++) {
            const el = data[index];
            if (el.SePaga) {
              sumaValor = sumaValor + el.Valor;
              sumaComision = sumaComision + el.Comision;
              sumaTotal = sumaTotal + el.ValorConComision;
            }
          }

          // Update footer 
          $(api.column(3).footer()).html('$' + sumaValor.toFixed(2));
          $(api.column(4).footer()).html('$' + sumaComision.toFixed(2));
          $(api.column(5).footer()).html('$' + sumaTotal.toFixed(2));
          $(api.column(6).footer()).html(botonPagar(sumaTotal));


        }
      });

      this.dataTablaRubros.on('change', '.dt-control-value', (e: any) => {

        let valor = parseFloat(e.currentTarget.value);
        let tr = e.currentTarget.closest('tr');
        let row = this.dataTablaRubros.row(tr);
        let valorConComision = row.data().Comision + valor;
        let valorFijo = row.data().ValorFijo;
        let tipoPago = item_producto.tipo_pago;
        console.log(tipoPago);
        if (0 >= valor) {
          UtilitariosService.Alertify_alert({ mensaje: `El monto a abonar no puede ser menor a ${valorFijo}`, type: "warning" });
          row.data().Valor = valorFijo;
        } else if (valorFijo < valor) {
          UtilitariosService.Alertify_alert({ mensaje: `El monto a abonar no puede ser mayor a ${valorFijo}`, type: "warning" });
          row.data().Valor = valorFijo;
        } else {
          row.data().Valor = valor;
          row.data().ValorConComision = valorConComision;
        }


        let datas: Array<DetallesRubros> = this.dataTablaRubros.data();
        this.dataTablaRubros.clear();
        this.dataTablaRubros.rows.add(datas).draw();


      });

      this.dataTablaRubros.on('change', '.dt-control-status-checkbox', (e: any) => {
        let SePaga = e.currentTarget.checked;
        let tr = e.currentTarget.closest('tr');
        let row = this.dataTablaRubros.row(tr);
        row.data().SePaga = SePaga;

        let datas: Array<DetallesRubros> = this.dataTablaRubros.data();
        this.dataTablaRubros.clear();
        this.dataTablaRubros.rows.add(datas).draw();
      });
    }
  }


  public renderBotonPagar(sumaTotal: any, item_producto: ItemProducto) {
    let realizarTipoPago = function (idTipoPago: number) { DasboardComponent.i.realizarPago(idTipoPago, item_producto) }

    let html = `<div  class="input-group-prepend show">
              <button [disabled] type="button" class="btn btn-block btn-lg dropdown-toggle [estilo]" data-toggle="dropdown" aria-expanded="false">
              PAGAR CON
              </button>
              <div class="dropdown-menu">
                <a class="dropdown-item id_btn_pago_saldo">Saldo $${DasboardComponent.i.data_cupo.total_saldo}</a>
                <a class="dropdown-item id_btn_pago_ganancia">Ganancia $${DasboardComponent.i.data_cupo.total_comision}</a> 
              </div>
            </div>`;
    if (sumaTotal == 0) {
      html = UtilitariosService.replaceText(html, '[estilo]', ' btn-danger');
      html = UtilitariosService.replaceText(html, '[disabled]', 'disabled="disabled"');
    } else {
      html = UtilitariosService.replaceText(html, '[estilo]', ' btn-primary');
      html = UtilitariosService.replaceText(html, '[disabled]', '');
    }

    setTimeout(() => {
      $(".id_btn_pago_saldo").click(function () { realizarTipoPago(1) });
      $(".id_btn_pago_ganancia").click(function () { realizarTipoPago(2) });
    }, 10);

    return html;
  }



  public bloquearReferencia(event: any, item_producto: ItemProducto) {
    var inputField = event.target;
    var inputValue = inputField.value;
    let longitud = item_producto.referencia_longitud;
    if (inputValue.length >= longitud) {
      inputField.value = inputValue.slice(0, longitud);
    }

  }

  public async cargarInfoProducto(item_producto: ItemProducto) {
    UtilitariosService.loadingElementOn('idHtml');

    let IdProducto = item_producto.id;
    let IdentidadProducto = item_producto.identidad;
    let Referencia = $("#id_in_referencia").val();
    let valido = this.validarInputReferencia(item_producto, Referencia);
    this.itemConsultaServicio = new ItemConsultaServicio();
    if (valido) {

      switch (item_producto.tipo_codigo) {
        case Constantes.tipo.servicio:
          //formulario pago de servicios 
          let endPoint = "red_facilito/consulta";
          let res: any = await GlobalService.Post(endPoint, { IdProducto, IdentidadProducto, Referencia });
          if (res.status == 200) {
            this.itemConsultaServicio = res.data;
          }
          break;
        case Constantes.tipo.recarga:
          let elProCantidad = document.getElementById('id_info_pro_cantidad');
          let Cantidad = elProCantidad.value || 0;
          Cantidad = Cantidad == 0 ? 1 : parseInt(Cantidad);
          this.itemConsultaServicio.Identificador = Referencia;
          this.itemConsultaServicio.RecargarCantidad = Cantidad;
          this.itemConsultaServicio.RecargarEdit = false;
          break;

        case Constantes.tipo.digital:
          alert("cargarInfoProducto no implement to digital");
          break;
        default:
          UtilitariosService.Alertify_alert({ mensaje: "Actualmente, no se dispone de una interfaz gráfica para procesar este producto o servicio.", type: "warning" });
          break;
      }


    }
    this.setValuesServicio(this.itemConsultaServicio, item_producto);
    UtilitariosService.loadingElementOff('idHtml');
  }

  public async setValuesServicio(data: ItemConsultaServicio, item_producto: ItemProducto) {
    const elIdentificador = document.getElementById("id_info_pro_Identificador");
    const elNombre = document.getElementById("id_info_pro_nombre");
    const elCantidad = document.getElementById('id_info_pro_cantidad');

    if (elIdentificador) {
      elIdentificador.value = data.Identificador;
    }

    if (elNombre) {
      elNombre.value = data.Nombre;
    }

    if (elCantidad) {
      elCantidad.disabled = data.RecargarEdit;
      elCantidad.value = data.RecargarCantidad;
      $("#id_bnt_pagar").html(this.renderBotonPagar(data.RecargarCantidad, item_producto));
    }



    if (this.dataTablaRubros) {
      if (this.dataTablaRubros.data().any()) {
        this.dataTablaRubros.clear();
      }
      this.dataTablaRubros.rows.add(data.DetallesRubros).draw();
    }
  }



  public validarInputReferencia(item_producto: ItemProducto, referencia: string) {

    let elemento_referencia = $("#id_in_referencia");
    elemento_referencia.removeClass("is-invalid");
    elemento_referencia.removeClass("is-valid");
    let result = false;
    let msj = "";
    let tamanio = referencia.length;
    let ref_titulo = item_producto.referencia_titulo;
    let ref_tipo = item_producto.referencia_tipo_dato;
    let ref_longitud = item_producto.referencia_longitud;

    let isRecarga = item_producto.tipo_codigo == '002';
    let valido = isRecarga ? ref_longitud == tamanio : ref_longitud >= tamanio

    if (valido) {
      result = true;

      switch (ref_tipo) {
        case "NUM":
          result = UtilitariosService.validarSoloNumeros(referencia);
          msj = "Se requieren solo numeros";
          break;
        case "TEXT":
          result = UtilitariosService.validarSoloTexto(referencia);
          msj = "Se requieren solo texto";
          break;
        case "ALF":
          result = UtilitariosService.validarSoloAlfaNumerico(referencia);
          msj = "Se requieren solo texto y numeros";
          break;


      }

    } else {
      msj = "El valor maximo de referencia  es de " + ref_longitud + " caracteres.";
    }

    if (!result) {
      UtilitariosService.Alertify_alert({ mensaje: msj, type: "warning" });
      let data: ItemConsultaServicio = new ItemConsultaServicio();
      this.setValuesServicio(data, item_producto);
      elemento_referencia.addClass("is-invalid");
    } else {
      elemento_referencia.addClass("is-valid");
    }
    return result;
  }

  public async realizarPago(IdTipoPago: number, item_producto: ItemProducto) {
    UtilitariosService.loadingElementOn('idHtml');
    debugger
    let DatosFactura = "1315463776|Jefferson Carrillo|0988633265|jaccarrillo@outlook.es|Manta";
    let IdProducto = item_producto.id;
    let IdentidadProducto = item_producto.identidad;
    let Referencia = this.itemConsultaServicio.Identificador;
    let res: any = {};
    let endPoint = "";

    switch (item_producto.tipo_codigo) {
      case Constantes.tipo.servicio:
        let IdTransaccion = this.itemConsultaServicio.IdTransaccion;
        let Nombre = this.itemConsultaServicio.Nombre;

        let DetallesRubros: Array<DetallesRubros> = [];
        let datas: Array<DetallesRubros> = this.dataTablaRubros.data();
        for (let index = 0; index < datas.length; index++) {
          const el = datas[index];
          if (el.SePaga) {
            let rubro: DetallesRubros = el;
            DetallesRubros.push(rubro);
          }
        }

        if (DetallesRubros.length == 0) {
          UtilitariosService.Alertify_alert({ mensaje: "No se ha seleccionado ningun rubro.", type: "warning" });
        } else {
          endPoint = "red_facilito/pago";
          res = await GlobalService.Post(endPoint, { DatosFactura, IdTipoPago, IdProducto, IdentidadProducto, Referencia, Nombre, IdTransaccion, DetallesRubros });
        }

        break;
      case Constantes.tipo.recarga:
        endPoint = "red_facilito/recargar";
        let Cantidad = this.itemConsultaServicio.RecargarCantidad;
        res = await GlobalService.Post(endPoint, { DatosFactura, IdTipoPago, IdProducto, IdentidadProducto, Referencia, Cantidad });
        break;

      case Constantes.tipo.digital:
        debugger
        //formulario pago de digitales
        let valido = this.getDataFormulario();
        if (valido) {
         endPoint = "red_facilito/contratar";
          let Forms = this.itemConsultaServicio.Forms;
          res = await GlobalService.Post(endPoint, { DatosFactura, IdTipoPago, IdProducto, IdentidadProducto, Referencia, Forms });
        }else {
          UtilitariosService.Alertify_alert({ mensaje: "Verificar información de datos requeridos.", type: "warning" });
        }
        break;
      default:
        UtilitariosService.Alertify_alert({ mensaje: "Actualmente, no se dispone de una interfaz gráfica para procesar este producto o servicio.", type: "warning" });
        break;
    }

    if (res.status == 200) {
      let titulo = " COMPROBANTE";
      this.dataPagoRealizado = res.data;
      let HTMLRecibo = this.dataPagoRealizado.HTMLRecibo; 
      let Mensaje = this.dataPagoRealizado.Mensaje;
      let OperadoPor = this.dataPagoRealizado.OperadoPor;
      let html = `
      <div class="col-12"> 
        <div id="id_cont_comprobante" class="modal-body" style="padding-bottom: 5px; padding-top: 5px;">            
        <style> 
          .font{
            margin-top: 5px;
            margin-bottom: 5px;
            font-family: monospace;
          }
        </style>  
          ${HTMLRecibo}
        </div>
     </div> `  ;

      var icono = "fa  fa-file-text-o";
      alertify.modalComprobante(html).setHeader(`<i class="${icono}"></i>${titulo}`).closeOthers();


    }
    UtilitariosService.loadingElementOff('idHtml');

  }


  public renderCardItem(data: ItemCard) {
    let html = ` 
      <div id="${data.key}" class="col-sm-3"> 
            <div class="info-box ${data.background} cursor_selector_pro"> 
                    <span>
                        <img class="elevation-2" src="${data.icono}" alt="${data.nombre}"
                            style=" width: 60px; height: 60px; padding: 5px; ">
                    </span>  
                    <div class="info-box-content">
                        ${data.nombre}
                    </div> 
            </div> 
      </div>
      ` ;
    return html;
  }



  async busquedaDirecta() {
    let val = $("#id_search_value").val();
    let title = "BUSQUEDA DE :" + val;
    title = title.toUpperCase();
    let idEl = "id_items_productos";
    let html = `<div class="modal-body">
                  <div id="${idEl}" class="col-sm-12 row">   
                  </div>              
                </div>
                `  ;
    alertify.modalEstandarProducto(html).setHeader(title);
    this.cargarProductosCategoria(idEl, null, val);
  }


  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.busquedaDirecta();
    }
  }

  customerLine(text: string, limit: number): string {
    const words = text.split(' ');
    let result = '';
    let line = '';
    for (const word of words) {
      if (line.length + word.length <= limit) {
        line += (line.length > 0 ? ' ' : '') + word;
      } else {
        result += (result.length > 0 ? '\n' : '') + line;
        line = word;
      }
    }
    result += (result.length > 0 ? '\n' : '') + line;
    return result;
  }


  public async shareOnWhatsApp(imagen: string) {
    const text = '¡Mira esta imagen increíble!';
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}&image=${encodeURIComponent(imagen)}`;
    //          <button (click)="shareOnWhatsApp(item.imagen)">Compartir en WhatsApp</button>
    window.open(shareUrl, '_blank');
  }

}
