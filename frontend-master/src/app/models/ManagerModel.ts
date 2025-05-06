export class moduloModel {
  id!: number;
  codigo!: string;
  nombre!: string;
  descripcion!: string;
  config!: configModel;
  tipo!: string;
  accion!: string[];
  perfil!: perfilModel;
}

export class configModel {
  titulo!: string;
  tabla!: string; 
  accion!:  Array<string>; 
  columns!: columnModel[];
}

export class columnModel {
  title!: string;
  data!: string;
  className!: string;
  show!: boolean;
  editar!: boolean;
  crear!: boolean;
  hidden?: boolean;
  type?: string;
  selector_text?: string;
  selector?: string;
  width?: string;
  visible?: boolean;
}

export class perfilModel {
  nombre!: string;
}
