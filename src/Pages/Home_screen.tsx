import { useEffect, useState } from "react";
import Header_homeScreen from "../Components/Header_homeScreen";
import { apiObtenerClientes } from "../API/api_clientes";
import type { Cliente } from "../model/clientes_model";
import RegistroCliente from "./Registro_cliente";

function Home_screen() {
    const [searchTerm, setSearchTerm] = useState('');
    const [people, setPeople] = useState<Cliente[]>([]);
    const [updateForm, setUpdateForm] = useState(false);
    const [datos, setDatos] = useState<Cliente>()
    useEffect(() => {
        apiObtenerClientes().then((res: any) => {
            setPeople(res.data[0]);
        }
        ).catch(error => {
            alert(`Error al obtener los datos de los clientes para Home Screen: ${error.message}`);
        });
    }, [])
    const filteredPersons = people.filter((p) =>
        p.nombres.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (updateForm){
        return <RegistroCliente cliente={datos} onClose={()=>setUpdateForm(false)}/>
    }
    else{
       return <>
        <div className="Screen_container">
            <input type="text" placeholder="Busqueda de cliente" className="search_client_input" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
            <div className="memberships_expiring_container">
                <div>
                    <Header_homeScreen>
                        <h3>Proximas membresias a vencer</h3>
                    </Header_homeScreen>
                    <Header_homeScreen tabla>
                        <h3>Nombre</h3>
                        <h3>Fecha de nacimiento</h3>
                    </Header_homeScreen>
                    <div className="memberships_expiring_list">
                        {filteredPersons.map((person, index) =>
                            <Header_homeScreen key={index} tabla funcion={()=>{
                                setDatos(person)
                                setUpdateForm(true);

                            }}>
                                <h3>{person.nombres} {person.apellido_paterno} {person.apellido_materno}</h3>
                                <h3 style={{ marginRight: "70px" }}>{person.fecha_nacimiento}</h3>
                            </Header_homeScreen>
                        )
                        }
                    </div>
                </div>
                <div className="estadisticas_clientes" />

            </div>
        </div>

    </>
    }

}
export default Home_screen;