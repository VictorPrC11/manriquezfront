import { useEffect, useState } from "react";
import type { Membresia } from "../model/membresia";
import { apiObtenerMembresias } from "../API/api_membresias";
import Header_table_clients from "../Components/Header_table_clients";
import IconButton from "../Components/IconButton";
import Registro_membresia from "./Registro_membresia";
import Spinner from "../Components/spinner";
import ImageComponent from "../Components/imageComponent";
import noPageFound from "../assets/page-not-found.png";

const Costos = () => {
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [membresias, setMembresias] = useState<Membresia[]>();
    const [agregarMembresia, setAgregarMembresia] = useState(false); 
    const [formActualizar, setFormActualizar]= useState(false);
    const [datosMembresia, setDatosMembresia] = useState<Membresia | undefined>()
    useEffect(() => {
        apiObtenerMembresias().then((res: any) => {
            setMembresias(res.data[0]);
        }).catch(error => {
            console.warn(`Error al obtener los pagos: ${error.message}`);
        }).finally(() => setLoading(false));
    }, []);

    const filteredMembresias = membresias?.filter((p) => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )  ;
    if(formActualizar){
        return <Registro_membresia onClose={()=>setFormActualizar(false)} membresiaData={datosMembresia}/>
    }
    if (agregarMembresia) {
        return <Registro_membresia onClose={()=>setAgregarMembresia(false)}/>
    }

    return loading ? <div className="spinner_container"><Spinner /></div> :
    
      membresias?.length !== undefined ? <div className="Screen_container">
            <div className="search_add_client_container">
                <input type="text" placeholder="Busqueda de membresia por nombre" className="search_client_input_screen" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <button className="add_client" onClick={() => {
                    setAgregarMembresia(true)
                }}>
                    <span className="texto_add_cliente">AGREGAR MEMBRESIA</span>
                </button>
            </div>

            <div className='header_estatico'>
                <Header_table_clients estatico>
                    <h1>Nombre</h1>
                    <h1>Precio</h1>
                    <div style={{ width: "20%" }} />
                </Header_table_clients>
            </div>

            <div className="table_clients_container">
                {filteredMembresias?.length !== 0 ? filteredMembresias?.map((m) => (
                    <Header_table_clients key={m.id_membresia}>
                        <h3 style={{fontWeight:"normal"}}>{m.nombre}</h3>
                        <h3 style={{fontWeight:"normal"}}>${m.costo}</h3>
                        
                        <div className='buttons_container'>
                             <IconButton 
                                icono={<img src={'src/assets/editar.png'} />} 
                                funcion={() => {
                                    setDatosMembresia(m);
                                    setFormActualizar(true)
                                }} 
                            />
                        </div>
                    </Header_table_clients>
                )):<h3>Sin membresias registradas</h3> }
            </div>
        </div> : <div className="spinner_container">
                        <ImageComponent src={noPageFound} />
                        <h3 style={{ color: "black" }}>No hay conexion con el servidor</h3>
                    </div>
}
export default Costos;