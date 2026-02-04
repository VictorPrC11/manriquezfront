import axios from "axios";
import type { Pago } from "../model/pago";


const API_URL = import.meta.env.DB_HOST || 'http://localhost:3000';


export const api_obtenerPagos = async (): Promise<Pago[]> => {
    const response = await axios.get(`${API_URL}/pagos/obtenerTodos`)
    return response.data
}
export const api_generaPago = async (pago: Pago) => {
    const response = await axios.post(`${API_URL}/pagos/crearPago`, pago)
    return response.data
}
export const api_EliminarPago = async () =>{
    const response = await axios.get(`${API_URL}/pagos/eliminarPago`)
    return response.data
}
