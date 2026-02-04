export interface Inscripcion{

    id_inscripcion?: number;
    id_cliente: number;
    costo: number;
    fecha_inicio: string;
    fecha_fin?: string;
    pagado: number;
    activa: number;
    
}