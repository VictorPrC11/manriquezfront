
import axios from "axios";
import type { Membresia } from '../model/membresia';
import type { Inscripcion } from "../model/inscripcion";
const API_URL = import.meta.env.DB_HOST || 'http://localhost:3000';
export const apiObtenerMembresias = async ()=> {
    const response = await axios.get(`${API_URL}/membresias/obtenerTodos`);
    return response.data;
}
export const apiCrearMembresia = async (membresia: Membresia)=>{
    const response  = await axios.post(`${API_URL}/membresias/agregarMembresia`, membresia)
    return response.data
}
export const apiActualizarMembresia = async(idCliente:number,membresia: Membresia) =>{
    await axios.put(`${API_URL}/membresias/actualizarMembresia/${idCliente}`,membresia )
}

export const apiCrearInscripcion = async (inscripcion:Inscripcion)=>{
    await axios.post(`${API_URL}/inscripciones/agregarInscripcion`, inscripcion )
}
export const apiObtenerInscripcion = async ()=> {
    const response = await axios.get(`${API_URL}/membresias/obtenerInscripcion`);
    return response.data;
}
export const apiRegistrarClienteTBInscripciones = async(inscripcion:Inscripcion)=>{
     await axios.post(`${API_URL}/inscripciones/registrarEnTBInscripciones`, inscripcion )
}