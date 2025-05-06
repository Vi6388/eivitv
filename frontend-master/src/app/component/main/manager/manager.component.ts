import { Component, Input, OnInit } from '@angular/core';
import { UtilitariosService } from 'src/app/service/utilitarios.service';
import { GlobalService } from 'src/app/service/global.service';
import { ParametrosService } from 'src/app/service/parametros.service';
import { DataManagerService } from 'src/app/providers/data-manager.service';
declare var $: any;
declare var window: any;
declare var JSONEditor: any;
declare var alertify: any;
@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css'],
  providers: [DataManagerService]
})
export class ManagerComponent implements OnInit {
  @Input() public objDataManager: any;
  public id_key = UtilitariosService.GenerateKeyHex();
  public strIdentificador: any;
  static strTabla: any;
  static Selectorlista: any = {};
  static objGlobalService: any;



  constructor(private dataManager: DataManagerService) { }


  async ngOnInit() {
    UtilitariosService.loadingElementOn('idHtml');
    this.strIdentificador = "manager_" + this.objDataManager.tabla + "_" + this.id_key;
    ManagerComponent.strTabla = this.objDataManager.tabla;
    await this.obtener_selectores();
    setTimeout(() => {
      this.renderizar_grid();
      UtilitariosService.loadingElementOff('idHtml');
    }, 100);
  }

  async obtener_selectores() {
    let columns = this.objDataManager.columns || [];
    let arrayListaSelectores = columns.filter((e: any) => { return e.type == "select" });

    for (let index = 0; index < arrayListaSelectores.length; index++) {
      const el = arrayListaSelectores[index];
      ManagerComponent.Selectorlista[el.data] = [];
      let endPoint = el.selector + "/show/selector";
      let selector_text = el.selector_text;
      let res: any = await GlobalService.Post(endPoint, { selector_text });
      if (res.status == 200) { ManagerComponent.Selectorlista[el.data] = res.data; }
    }


  }

  renderizar_grid() {
    let manager = this.objDataManager;
    let columns: any = manager.columns || [];
    manager.columns = columns;
    let permisos: PermisosModel = manager.permisos || [];
    let opciones: Array<any> = manager.opciones || [];
    let strIdentificador = this.strIdentificador;
    let url_show = `${ParametrosService.url_service}/${manager.tabla}/show/list`;
    let token = UtilitariosService.getToken();
    columns = cargar_configuracion_columna(manager);


    let buttons = [];
    if (permisos.create) {
      buttons.push({
        text: '<i class="far fa-plus-square"></i>',
        titleAttr: 'Crear nuevo registro',
        action: function (e: any, dt: any, node: any, config: any) {
          form_show_create(manager);
        }
      });
    }

    buttons.push({
      text: '<i class="fa fa-files-o"></i>',
      titleAttr: 'Copy Contenido',
      extend: "copy",
      exportOptions: {
        columns: ':visible :not(.noVis)'
      }
    });
    buttons.push({
      text: 'Exportar&nbsp;&nbsp;',
      extend: 'collection',
      buttons: [
        {
          text: '<i class="fa fa-print"></i>',
          titleAttr: 'Imprimir Contenido',
          extend: "print",
          title: "<h1>Reporte de " + manager.titulo + "</h1>",
          messageTop: 'Toda la información de este reporte es estrictamente confidencial.',
          exportOptions: {
            columns: ':visible :not(.noVis)'
          },
          customize: function (win: any) {
            win.document.title = "Vista Previa";
            $(win.document.body)
              .css('font-size', '10pt')
              .prepend(
                '<img src="https://i.ibb.co/9yLGBmd/logo-asitecman.png" style="position:absolute; top:0; left:0; OPACITY: 10%;" />'
              );

            $(win.document.body).find('table')
              .addClass('compact')
              .css('font-size', 'inherit');
          }

        }
        , {
          text: '<i class="fa  fa-file-pdf-o"></i>',
          titleAttr: 'Exportar a PDF',
          extend: "pdf",
          title: "Reporte de " + manager.titulo,
          exportOptions: {
            columns: ':visible :not(.noVis)'
          },

        },
        {
          text: '<i class="fa  fa-file-excel-o"></i>',
          titleAttr: 'Exportar a EXCEL',
          extend: "excel",
          title: "Reporte de " + manager.titulo,
          exportOptions: {
            columns: ':visible :not(.noVis)'
          }
        },
        {
          text: '<i class="fa fa-file-code-o"></i>',
          titleAttr: 'Exportar a CSV',
          extend: "csv",
          title: "Reporte de " + manager.titulo,
          exportOptions: {
            columns: ':visible :not(.noVis)'
          }
        },
      ]
    });
    buttons.push({
      text: 'Columnas&nbsp;&nbsp;',
      extend: "colvis",
      columns: ':not(.noVis)'
    });


    let objDataTable = $("#" + strIdentificador).DataTable({
      dom: '<"top"Bf>rt<"bottom"<"right"l><"left"i>><"bottom"p>',
      processing: true,
      serverSide: true,
      paging: true,
      lengthChange: true,
      searching: true,
      ordering: true,
      info: true,
      autoWidth: true,
      responsive: true,
      ajax: {
        url: url_show,
        type: "POST",
        headers: {
          token: token
        },
        error: function (jqXHR: any, ajaxOptions: any, thrownError: any) {
          let responseJSON = jqXHR.responseJSON;
          let statusText = jqXHR.statusText;
          let mensaje = statusText + ":" + responseJSON.message;
          if (responseJSON.auth) {
            UtilitariosService.removeToken();
            window.location = '/login';
          }
          UtilitariosService.Alertify_alert({ mensaje, type: "warning" });
        }
      },

      columnDefs: [
        {
          targets: '_all',
          className: "text-center dt-control-" + strIdentificador,
          createdCell: function (td: any, cellData: any, rowData: any, row: any, col: any) {
            $(td).css('padding-left', '15px');
            $(td).css('padding-bottom', '5px');
            $(td).css('padding-top', '5px');
          },
        },
        {
          targets: [0],
          visible: false,
          searchable: false
        },
      ],
      select: {
        style: 'os',
        selector: 'td:first-child'
      },
      order: [[1, "desc"]],
      columns: columns,

      buttons: {
        dom: {
          button: {
            className: 'btn btn-outline-primary btn-sm'
          }
        },
        buttons,
      }
    });

    objDataTable.buttons().container().appendTo('#' + strIdentificador + '_wrapper .col-md-6:eq(0)');

    objDataTable.on('xhr.dt', function () {
      renderizar(objDataTable);
    });

    objDataTable.on('responsive-resize', function (e: any, objDataTable: any, columns: any) {
      //se ejecuta cuando cambia de tamaño
    });

    objDataTable.on('click', 'tr.dt-control-' + strIdentificador, (e: any) => {
      let tr = e.currentTarget.closest('tr');
      let row = objDataTable.row(tr);
      if (row.child.isShown()) {
        renderizar(objDataTable);
      }
    });





    objDataTable.on('click', '.dt-control-show-' + strIdentificador, (e: any) => {
      let tr = e.currentTarget.closest('tr');
      let row = objDataTable.row(tr);
      form_show(manager, row);
    });

    objDataTable.on('click', '.dt-control-edit-' + strIdentificador, (e: any) => {
      let tr = e.currentTarget.closest('tr');
      let row = objDataTable.row(tr);
      form_show_edit(manager, row);

    });

    objDataTable.on('click', '.dt-control-delete-' + strIdentificador, (e: any) => {
      let tr = e.currentTarget.closest('tr');
      let row = objDataTable.row(tr);
      accion_eliminar(row);
    });

    objDataTable.on('change', '.dt-control-status-' + strIdentificador, (e: any) => {
      let estado = e.currentTarget.checked
      let tr = e.currentTarget.closest('tr');
      let row = objDataTable.row(tr);
      row.data().estado = estado ? 1 : 0;
      accion_editar_line(row);
    });


    objDataTable.on('click', '.dt-control-show-img-' + strIdentificador, (e: any) => {
      let tr = e.currentTarget.closest('tr');
      let val = e.currentTarget.value;
      let row = objDataTable.row(tr);
      form_show_img(manager, row, val);
    });




    const renderizar = (objDataTable: any) => {
      setTimeout(() => {
        $('.dt-control-status-' + this.strIdentificador).bootstrapToggle({
          on: 'Habilitado',
          off: 'Deshabilitado'
        });
      }, 20);
    }




    function cargar_configuracion_columna(objDataManager: any) {
      var colOpciones = { title: "OPCIONES", data: "id", width: "17%", className: 'noVis text-center' };

      if (permisos.show || permisos.edit || permisos.delete || opciones.length) {
        objDataManager.columns.push(colOpciones);
      }

      let columns = [];
      for (let index = 0; index < objDataManager.columns.length; index++) {
        var element: any = objDataManager.columns[index];

        if (element.title == "OPCIONES") {
          element.render = render_opciones;
        }

        if (element.type == "switch") {
          element.render = render_estado;
        }
        if (element.type == "select") {
          element.render = render_selector;
        }
        if (element.type == "list") {
          element.render = render_list;
        }
        if (element.type == "file") {
          element.render = render_file;
        }

        if (element.type == "function") {
          element.render = element.function;
        }

        columns[index] = element;
      }
      return columns;
    }

    function render_file(val: any, type: any, row: any, meta: any) {
      var file = val;
      return `
      <img src="${file}" onerror="this.src='assets/img/default/not_image.jpg';"  alt="${file}" width="90" height="90">
      <br>
      <button value="${file}" type="button" class="btn btn-info btn-sm dt-control-show-img-${strIdentificador}" style="margin-right: 5px;margin-left: 5px;"><i class="fa fa-search-plus"></i></button>
      
      `;
    }

    function render_estado(e: any, type: any, row: any, meta: any) {
      var status = row.estado == 1 ? " checked " : " ";
      return `<input class="btn-sm dt-control-status-${strIdentificador}" type="checkbox" ${status} data-toggle="toggle"   data-onstyle="success" data-offstyle="danger" data-size="sm">`;
    }

    function render_opciones(td: any, cellData: any, rowData: any, row: any, col: any) {
      let html = "";
      if (permisos.show) {
        html += `<button type="button" class="btn btn-info btn-sm dt-control-show-${strIdentificador}" style="margin-right: 5px; margin-left: 5px;"> <i class="fas fa-eye"></i></button>`;
      }

      if (permisos.edit) {
        html += `<button type="button" class="btn btn-success btn-sm dt-control-edit-${strIdentificador}" style="margin-right: 5px; margin-left: 5px;"><i class="fas fa-edit"></i></button>`;
      }

      if (permisos.delete) {
        html += `<button type="button" class="btn btn-danger btn-sm dt-control-delete-${strIdentificador}" style="margin-right: 5px; margin-left: 5px;"> <i class="fas fa-trash"></i></button>`;
      }
      opciones.forEach(fun => {
        html += fun(td, cellData, rowData, row, col);
      });


      return html;
    }

    function render_selector(val: any, type: any, row: any, meta: any) {
      let col = meta.col;
      let column = meta.settings.aoColumns[col];
      let data = column.data;
      return getTextSelect(data, val);
    }

    function render_list(val: any, type: any, row: any, meta: any) {
      let col = meta.col;
      let column = meta.settings.aoColumns[col];
      let id = column.data;
      let listData: any = column.list || [];
      listData = listData.map((e: any) => { return { id: e.v, text: e.k }; });
      let listDefault: Array<any> = listData.filter((e: any) => e.id == val);
      let valueDefault = "";
      if (listDefault.length != 0) {
        let itemDefault = listDefault[0];
        valueDefault = itemDefault.text;
      }
      return valueDefault;
    }





    function getTextSelect(strNameList: any, intValue: any) {
      let text = "";
      if (intValue) {
        let arrayItemDefault = ManagerComponent.Selectorlista[strNameList];
        arrayItemDefault = arrayItemDefault.filter((e: any) => { return e.id == intValue });
        text = arrayItemDefault ? arrayItemDefault[0].text : "";
      }
      return text;
    }



    const generarControles = (objDataManager: any, row: any, form: String) => {
      let controles = "";
      let data: any = row ? row.data() : {};

      for (let index = 0; index < objDataManager.columns.length; index++) {
        const el = objDataManager.columns[index];
        let id = el.data;
        let valor = data[id] || "";
        let type = el.type || "text";
        let hidden = el.hidden ? " hidden_form_row " : "";
        let title = el.title;
        let isEdit = form == "edit" && el.editar;
        let isCreate = form == "create" && el.crear;
        let isShow = form == "show" && el.show;
        let disabled = isShow ? 'disabled="disabled"' : "";
        let valueDefault = ` <option value="" disabled selected>Selecciona una opción</option>`;
        let required = el.required || false;
        let length = el.length || 1000;

        let labelRequired = required ? `<span style="color: red;">*</span>` : "";

        switch (true) {
          case type == 'select':
            if (valor) {
              let text = getTextSelect(id, valor);
              valueDefault = `<option value="${valor}"  selected  > ${text}</option>`;
            }

            controles +=
              `       <div class="col-sm-12 ${hidden}"> ` +
              `            <div class="form-group">` +
              `               <label class="capitalize">${labelRequired + title}</label>` +
              `               <select  id="${id}" class="form-control select2"   style="width: 100%;"  ${disabled} >` +
              valueDefault +
              `               </select>` +
              `            </div>` +
              `        </div>`;
            if (isEdit || isCreate) {
              setTimeout(() => {
                $(`#${id} `).select2({
                  data: ManagerComponent.Selectorlista[id],
                  dropdownParent: $('.ajs-modal')
                });
              }, 100);
            }

            break;

          case type == 'list':
            let listData: any = el.list || [];
            listData = listData.map((e: any) => { return { id: e.v, text: e.k }; });
            let listDefault: Array<any> = listData.filter((e: any) => e.id == valor);
            if (listDefault.length != 0) {
              let itemDefault = listDefault[0];
              valueDefault = `<option value="${itemDefault.id}"  selected  > ${itemDefault.text}</option>`;
            }

            controles +=
              `       <div class="col-sm-12 ${hidden}"> ` +
              `            <div class="form-group">` +
              `               <label class="capitalize">${labelRequired + title}</label>` +
              `               <select  id="${id}" class="form-control select2"   style="width: 100%;"  ${disabled} >` +
              valueDefault +
              `               </select>` +
              `            </div>` +
              `        </div>`;
            if (isEdit || isCreate) {
              setTimeout(() => {
                $(`#${id} `).select2({
                  data: listData,
                  dropdownParent: $('.ajs-modal')
                });
              }, 100);
            }

            break;

          case type == 'file':
            let input = `<img id="${id}" src="${valor}"  style="width: 50%; height: 50%;" class="form-control capitalize" disabled="disabled"/>`;
            if (isCreate || isEdit) {
              input = `<input id="${id}" type="file" class="form-control capitalize" placeholder="INGRESE ${title}"  ${disabled}/>`;
            }
            controles +=
              `       <div class="col-sm-12 ${hidden}"> ` +
              `           <label class="capitalize">${labelRequired + title}</label>` +
              `            <div class="form-group" style="display: flex; justify-content: center;">` +
              input +
              `            </div>` +
              `        </div>`;
            break;



          case type == 'json':
            controles +=
              `       <div class="col-sm-12 ${hidden}"> ` +
              `            <div class="form-group">` +
              `                <label class="capitalize">${labelRequired + title}</label>` +
              `                <div id="${id}" ></div>` +
              `            </div>` +
              `        </div>`;

            let container = document.getElementById(id);
            let options: any = { "mode": "view", "search": true };
            if (isEdit || isCreate) {
              options = {
                "mode": "tree",
                "search": true,
                "modes": ['code', 'form', 'text', 'tree', 'view']
              }
            }
            setTimeout(() => {
              let container = document.getElementById(id);
              this.dataManager.setObjEditorJson(new JSONEditor(container, options));
              let initialJson = JSON.parse(valor);
              this.dataManager.getObjEditorJson().set(initialJson);
            }, 100);
            break;

          case type == 'switch' && isShow:
            let estado: any = { activo: { color: "success", text: "Habilitado" }, inactivo: { color: "danger", text: "Deshabilitado" } };
            let status: any = valor == 1 ? "activo" : "inactivo";
            controles +=
              `       <div class="col-sm-12 ${hidden}"> ` +
              `            <div class="form-group">` +
              `                <label class="capitalize">${labelRequired + title}</label>` +
              `                <button type="button" class="btn btn-block bg-gradient-${estado[status].color} " disabled="disabled">${estado[status].text}</button> ` +
              `            </div>` +
              `        </div>`;
            break;

          default:

            if (isShow || isEdit || isCreate) {
              controles +=
                `       <div class="col-sm-12 ${hidden}"> ` +
                `            <div class="form-group">` +
                `                <label class="capitalize">${labelRequired + title}</label>` +
                `                <input id="${id}" type="${type}"  value="${valor}"   maxlength="${length}"  class="form-control capitalize" placeholder="INGRESE ${title}"   ${disabled}/>` +
                `            </div>` +
                `        </div>`;
            }


            break;
        }


      }
      return controles;
    }



    const form_show_create = (objDataManager: any) => {
      UtilitariosService.loadingElementOn('idHtml');
      var titulo = "Crear nuevo registro " + objDataManager.titulo;
      var botones = {
        ok: {
          titulo: "Crear",
          evento: async function () {
            let isComplete = await accion_create(objDataManager);
            if (isComplete) {
              alertify.closeAll();
            }
          }
        },
        cancel: {
          titulo: "Cancelar",
          evento: null
        }
      }

      var icono = " ";
      var controles = generarControles(objDataManager, null, "create");
      var html = `<div   class="modal-body" tabindex="-1">` +
        `          <div class="row">        ` +
        `          ${controles}` +
        `           </div>` +
        `         </div>`;

      UtilitariosService.Alertify_Modal(icono, titulo, html, botones);
      UtilitariosService.loadingElementOff('idHtml');

    }


    const form_show = (objDataManager: any, row: any) => {
      UtilitariosService.loadingElementOn('idHtml');
      var title = "Visualización registro " + objDataManager.titulo;
      var controles = generarControles(objDataManager, row, "show");
      var html = `<div class="modal-body">` +
        `          <div class="row">        ` +
        `          ${controles}` +
        `           </div>` +
        `         </div>`;
      alertify.modalEstandarPrimary(html).setHeader(title);
      UtilitariosService.loadingElementOff('idHtml');
    }

    const form_show_edit = (objDataManager: any, row: any) => {
      UtilitariosService.loadingElementOn('idHtml');
      var titulo = "Editar registro " + objDataManager.titulo;
      var botones = {
        ok: {
          titulo: "Actualizar",
          evento: async function () {
            let isComplete = await accion_update(objDataManager);
            if (isComplete) {
              alertify.closeAll();
            }
          }
        },
        cancel: {
          titulo: "Cancelar",
          evento: null
        }
      }
      var icono = "";
      var controles = generarControles(objDataManager, row, "edit");
      var html = `<div class="modal-body">` +
        `          <div class="row">        ` +
        `          ${controles}` +
        `           </div>` +
        `         </div>`;

      UtilitariosService.Alertify_Modal(icono, titulo, html, botones);
      UtilitariosService.loadingElementOff('idHtml');
    }

    function form_show_img(objDataManager: any, row: any, file: any) {
      UtilitariosService.loadingElementOn('idHtml');
      let data: any = row.data();
      var title = "Visualización de imagen";
      var html = `
            <div class="modal-body">
               <div class="row">
               <img src="${file}" onerror="this.src='assets/img/default/not_image.jpg';"  alt="${file}" width="100%" height="100%">
               </div>
              </div>
              `;

      alertify.modalEstandarPrimary(html).setHeader(title);
      UtilitariosService.loadingElementOff('idHtml');
    }


    function accion_eliminar(row: any) {
      let data: any = row.data();
      let strIdentificador = data.codigo || data.nombre || "SD";
      let titulo = "Alerta";
      let botones = {
        ok: {
          titulo: "SI",
          evento: async function () {
            UtilitariosService.loadingElementOn('idHtml');
            let endPoint = ManagerComponent.strTabla + "/delete";
            let res: any = await GlobalService.Post(endPoint, data);
            if (res.status == 200) {
              UtilitariosService.Alertify_alert({ mensaje: res.message, type: "success" });
              row.remove().draw();
            }
            UtilitariosService.loadingElementOff('idHtml');
          }
        },
        cancel: {
          titulo: "NO",
          evento: null
        }
      }
      var icono = "fa fa-warning";
      var Html = `<p class="text-center">¿Seguro desea eliminar el registro ${strIdentificador}?</p> `;

      UtilitariosService.Alertify_confirmacion(icono, titulo, Html, botones);

    }

    async function accion_editar_line(row: any) {
      UtilitariosService.loadingElementOn('idHtml');
      let data = row.data();
      let endPoint = ManagerComponent.strTabla + "/update";
      let res: any = await GlobalService.Post(endPoint, data);
      if (res.status == 201) {
        UtilitariosService.Alertify_alert({ mensaje: res.message, type: "success" });
      }
      UtilitariosService.loadingElementOff('idHtml');
    }


    const accion_create = async (objDataManager: any) => {
      UtilitariosService.loadingElementOn('idHtml');
      let data: any = {};
      let isComplete = true;
      for (let index = 0; index < objDataManager.columns.length; index++) {
        const el = objDataManager.columns[index];
        if (el.crear) {
          let required = el.required || false;
          let elemento = $("#" + el.data);
          let val = elemento.val();
          if (required && !val) {
            UtilitariosService.Alertify_alert({ mensaje: `El campo ${el.title} es requerido`, type: "warning" });
            isComplete = false;
          } else {
            switch (el.type) {
              case 'file':
                if (val != '') {
                  let file = elemento[0].files[0];
                  data[el.data] = await UtilitariosService.toBase64(file);
                }
                break;
              case 'json':
                let objEditorJson = this.dataManager.getObjEditorJson();
                data[el.data] = JSON.stringify(objEditorJson.get());
                break;
              default:
                data[el.data] = val;
                break

            }
          }

        }
      }
      if (isComplete) {
        let endPoint = ManagerComponent.strTabla + "/save";
        let res: any = await GlobalService.Post(endPoint, data);
        if (res.status == 201) {
          UtilitariosService.Alertify_alert({ mensaje: res.message, type: "success" });
          objDataTable.ajax.reload();
        } else {
          isComplete = false;
        }
      }

      UtilitariosService.loadingElementOff('idHtml');
      return isComplete;

    }

    const accion_update = async (objDataManager: any) => {
      UtilitariosService.loadingElementOn('idHtml');
      let data: any = {};
      let isComplete = true;
      for (let index = 0; index < objDataManager.columns.length; index++) {
        const el = objDataManager.columns[index];
        if (el.editar) {
          let required = el.required || false;
          let elemento = $("#" + el.data);
          let val = elemento.val();
          if (required && !val) {
            UtilitariosService.Alertify_alert({ mensaje: `El campo ${el.title} es requerido`, type: "warning" });
            isComplete = false;
          } else {
            switch (el.type) {
              case 'file':
                if (val != '') {
                  let file = elemento[0].files[0];
                  data[el.data] = await UtilitariosService.toBase64(file);
                }
                break;
              case 'json':
                let objEditorJson = this.dataManager.getObjEditorJson();
                data[el.data] = JSON.stringify(objEditorJson.get());
                break;
              default:
                data[el.data] = val;
                break

            }
          }
        }
      }
      if (isComplete) {
        let endPoint = ManagerComponent.strTabla + "/update";
        let res: any = await GlobalService.Post(endPoint, data);
        if (res.status == 201) {
          UtilitariosService.Alertify_alert({ mensaje: res.message, type: "success" });
          objDataTable.ajax.reload();
        } else {
          isComplete = false;
        }
      }
      UtilitariosService.loadingElementOff('idHtml');
      return isComplete;
    }
  }
}
class PermisosModel {
  show: boolean = false;
  create: boolean = false;
  edit: boolean = false;
  delete: boolean = false;
}


class dataList {
  id!: String;
  test!: String;
}

