import axios from 'axios'
const API_URL = import.meta.env.DB_HOST || 'http://localhost:3000';
export const agregarUsuarioTerminal = async (usuario: any) => {

    try {
        const response = await axios.put(`${API_URL}/terminal/addUser`, usuario)
        return response
    } catch (error) {
        console.log(error)
    }
} 
export const actualizarVigenciaTerminal = async (usuario:any)=>{
    try {
        const response = await axios.put(`${API_URL}/terminal/updateUserData`, usuario)
        return response
    } catch (error) {
        console.log(error)
    }
}