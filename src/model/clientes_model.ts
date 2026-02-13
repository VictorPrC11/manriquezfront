
export interface Cliente{

    id_cliente?: number;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    fecha_nacimiento: string;
    correo?:string;
    celular?: string;
    direccion?: string;
    fecha_registro: string;
    activo?: boolean;
    foto?: null | File;
}


