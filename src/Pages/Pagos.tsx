import { useEffect, useState } from 'react';
import Header_table_clients from '../Components/Header_table_clients';
import { api_obtenerPagos } from '../API/api_pagos';
import type { Pago } from '../model/pago';
import Spinner from '../Components/spinner';
import ImageComponent from '../Components/imageComponent';
import noPageFound from '../assets/page-not-found.png'
const Pagos = ()=>{
    const [searchTerm, setSearchTerm] = useState('');
    const [pagos, setPagos] = useState<Pago[]>();
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        api_obtenerPagos().then((res: any) => {
            setPagos(res.data[0]);
        }).catch(error => {
            console.warn(`Error al obtener los pagos: ${error.message}`);
        }).finally(()=>{
            setLoading(false)
        });
    }, []);

    const filteredPagos = pagos?.filter((p) => 
    p.metodo_pago.toLowerCase().includes(searchTerm.toLowerCase())
    )  ;

    
    if(loading){
       return <div className='spinner_container'>
            <Spinner/>
        </div>
    }
    return pagos?.length !== undefined ?  <div className="Screen_container">
            <div className="search_add_client_container">
                <input type="text" placeholder="Busqueda de pago por metodo de pago" className="search_client_input_screen" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <button className="add_client" onClick={() => {
                    //setGenerarPagoForm(true)
                    window.location.reload()
                }}>
                    <span className="texto_add_cliente">GENERAR PAGO</span>
                </button>
            </div>
            <div className='header_estatico'>
                <Header_table_clients estatico>
                    <h1>Id cliente</h1>
                    <h1>Monto</h1>
                    <h1>Tipo</h1>
                    <div style={{ width: "20%" }} />
                </Header_table_clients>
            </div>
            <div className="table_clients_container">
                {
                    pagos.length!== 0 ? filteredPagos?.map((pagos) => (
                    <Header_table_clients key={pagos.id_pago}>
                        <h3 style={{fontWeight:"normal"}}>{pagos.id_cliente}</h3>
                        <h3 style={{fontWeight:"normal"}}>{pagos.monto}</h3>
                        <h3 style={{fontWeight:"normal"}}>{pagos.tipo}</h3>
                        <div className='buttons_container'>
                        </div>
                    </Header_table_clients>
                )) : <h3>No existen pagos realizados</h3>

                }
            </div>
        </div> : <div className='spinner_container'>
             <ImageComponent src={noPageFound} />
                        <h3 style={{ color: "black" }}>No hay conexion con el servidor</h3>
        </div>
}

export default Pagos

