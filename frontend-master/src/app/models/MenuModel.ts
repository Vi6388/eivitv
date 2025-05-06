

export class menuModel {
  id!: number;
  id_perfil!: number;
  id_modulo!: number;
  id_menu!: number;
  nombre!: string;
  descripcion!: string;
  icono!: string;
  link!: string;
  subMenus!: Array<menuModel>;
  hrefValor!: string;

}

