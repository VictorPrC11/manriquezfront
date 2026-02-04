import { useEffect, useState } from "react";
import Header_homeScreen from "../Components/Header_homeScreen";
import { apiObtenerClientes, apiVencimientoMembresiasClientes } from "../API/api_clientes";
import type { Cliente } from "../model/clientes_model";
import Detalles_cliente from "./Detalles_clientes";
import Spinner from "../Components/spinner";
import ImageComponent from "../Components/imageComponent";
import noPageFound from "../assets/page-not-found.png"

function Home_screen() {
    const [searchTerm, setSearchTerm] = useState('');
    const [people, setPeople] = useState<any>();
    const [detallesForm, setDetallesForm] = useState(false);
    const [datos, setDatos] = useState<number>();
    const [dataLoaded, setDataLoaded] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0)
    const pageSize = 10
    const totalPages = Math.ceil(totalRecords / pageSize);
    useEffect(() => {
        const offset = (currentPage - 1) * pageSize;
        const parameters = {
            p_pageSize: pageSize,
            p_offset: offset
        }
        console.log(parameters)
        apiVencimientoMembresiasClientes(parameters).then((res: any) => {
            setPeople(res.data[0]);
            setDataLoaded(true)
        }

        ).catch(error => {
            console.warn("no se pudieron obtener los datos", error)

        }).finally(() => setDataLoaded(true));
    }, [])
    const handlerEnter = (e:any)=>{
        if(e.key === 'Enter')
        {
            console.log("FUNCIONA CORRECTAMENTE")
        }
    }
    const filteredPersons = people?.filter((p: any) =>
        p.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (detallesForm) {
        //return <RegistroCliente cliente={datos} onClose={()=>setUpdateForm(false)}/>
        return <Detalles_cliente onClose={() => setDetallesForm(false)} cliente={datos!} />
    }
    else {
        return <>{
            !dataLoaded ? <div className="spinner_container"><Spinner /></div> :
                people?.length !== undefined ?
                    <div className="Screen_container">
                        <input type="text" placeholder="Busqueda de cliente" className="search_client_input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handlerEnter} />
                        <div className="memberships_expiring_container">
                            <div>
                                <Header_homeScreen>
                                    <h3>Proximas membresias a vencer</h3>
                                </Header_homeScreen>
                                <Header_homeScreen tabla funcion={() => console.log(people.length)}>
                                    <h3>Nombre</h3>
                                    <h3>Fecha de vencimiento</h3>
                                </Header_homeScreen>
                                <div className="memberships_expiring_list">
                                    {
                                        filteredPersons?.length !== 0 ? filteredPersons?.map((person: any, index: any) =>
                                            <Header_homeScreen key={index} tabla funcion={() => {
                                                setDatos(person.id_cliente)
                                                setDetallesForm(true);


                                            }}>
                                                <h3 style={{fontWeight:"normal"}}>{person.nombre_cliente}</h3>
                                                <h3 style={{ marginRight: "70px",fontWeight:"normal" }}>{person.fecha_fin}</h3>
                                            </Header_homeScreen>
                                        ) : <h3>Sin membresias asignadas a clientes</h3>
                                    }

                                </div>
                            </div>
                            <div className="estadisticas_clientes" />
                        </div>
                    </div> : <div className="spinner_container">
                        <ImageComponent src={noPageFound} />
                        <h3 style={{ color: "black" }}>No hay conexion con el servidor</h3>
                    </div>
        }
        </>
    }

}
export default Home_screen;