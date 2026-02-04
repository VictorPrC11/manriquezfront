import axios from 'axios';
import type { MembresiaCliente } from '../model/membresias_cliente';

const API_URL = import.meta.env.DB_HOST || 'http://localhost:3000';

export const apiObtenerMembresiasClientes = async()=>{
    const response = await axios.get(`${API_URL}/membresiasCliente/obtenerTodos`)
    return response.data;
}
export const apiCrearMembresiaCliente = async(membresiaClienteObj: MembresiaCliente)=>{
    const response = await axios.post(`${API_URL}/membresiasCliente/crearMembresia`, membresiaClienteObj)
    return response.data;
}