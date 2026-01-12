
export interface Pago{
    id_pago?: number;
    id_cliente: number;
    tipo: 'INSCRIPCION' | 'MEMBRESIA' | 'OTRO' | string;
    monto: number;
    fecha_pago: string;
    metodo_pago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';
    notas?: string;
}