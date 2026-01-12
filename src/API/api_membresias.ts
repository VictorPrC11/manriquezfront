
import axios from "axios";
import type{ Membresia } from '../model/membresia';
const API_URL=import.meta.env.DB_HOST ||'http://localhost:3000';
export const apiObtenerMembresias = async ():Promise<Promise<Membresia>[]>=>{
    const response = await axios.get(`${API_URL}/membresias/obtenerTodos`);
    return response.data;
}