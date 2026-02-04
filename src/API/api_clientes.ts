import type { Cliente } from "../model/clientes_model";
import axios from "axios";

const API_URL=import.meta.env.DB_HOST || 'http://localhost:3000';

//CRUD CLIENTES
export const apiCrearCliente = async (cliente:any)=>{
    //Crear un objeto de tipo cliente que tome los datos del formulario
    
    const clienteObj: Cliente = {
        nombres: cliente.nombres,
        apellido_paterno: cliente.apellido_paterno,
        apellido_materno: cliente.apellido_materno,
        fecha_nacimiento: cliente.fecha_nacimiento,
        correo: cliente.correo,
        celular: cliente.celular,
        direccion: cliente.direccion,
        fecha_registro: new Date().toISOString().split('T')[0],
        activo: true
    };
    const response = await axios.post(`${API_URL}/clientes/agregarCliente`, clienteObj);
    return response.data;
}

export const apiObtenerClientes = async (parameters: any):Promise<Cliente[]>=>{
    const response = await axios.post(`${API_URL}/clientes/obtenerTodos`,parameters );
    return response.data;
}

export const apiObtenerClientePorId = async (id:number):Promise<Cliente>=>{
    const response = await axios.get(`${API_URL}/clientes/obtenerClientePorId/${id}`);
    return response.data;
}

export const apiActualizarCliente = async (id:number, cliente:Cliente)=>{
    const response = await axios.put(`${API_URL}/clientes/actualizarCliente/${id}`, cliente);
    return response.data;
}

export const apiEliminarCliente = async (id_cliente:number)=>{
    const response = await axios.delete(`${API_URL}/clientes/eliminarCliente/${id_cliente}`);
    return response.data;
}
export const apiObtenerDetallesCliente = async(id_cliente:any)=>{
    const response = await axios.get(`${API_URL}/clientes/detallesCliente/${id_cliente}`)
    return response.data;
}
export const apiObtenerPagosCliente = async (id_cliente:number)=>{
    const response = await axios.get(`${API_URL}/clientes/obtenerPagosCliente/${id_cliente}` )
    return response.data
}

export const apiVencimientoMembresiasClientes = async(parameters:any)=>{
    const response = await axios.post(`${API_URL}/clientes/vencimientoMembresias`, parameters)
    return response.data
}