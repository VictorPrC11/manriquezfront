import { procesarCSV } from "../InsercionMasiva/insercion";
import mensualidad from "../InsercionMasiva/Mensualidad.csv?url"
import trimestre from "../InsercionMasiva/Trimestre.csv?url"
import semestre from "../InsercionMasiva/Semestre.csv?url"
import quicena from "../InsercionMasiva/Quincena.csv?url"
const Estadisticas = () => {
    return <div className="Screen_container">
        <h1 style={{color:"black"}}>ESTADISTICAS</h1>
        <button onClick={()=>{
            procesarCSV(mensualidad, 1) //FUNCIONAL
            procesarCSV(trimestre, 2) //FUNCIONAL
            procesarCSV(semestre, 4) //FUNCIONAL
            procesarCSV(quicena, 8) //FUNCIONAL
        }
            
            
            }><h1 style={{color:"white"}}>INSERTAR TODOS LOS CLIENTES</h1></button>
    </div>
}
export default Estadisticas;