import { useEffect, useState, useMemo } from 'react';
import { apiEliminarCliente, apiObtenerClientes } from '../API/api_clientes';
import type { Cliente } from '../model/clientes_model';
import Header_table_clients from '../Components/Header_table_clients';
import IconButton from '../Components/IconButton';
import RegistroCliente from './Registro_cliente';
import Spinner from '../Components/spinner';
import ImageComponent from '../Components/imageComponent';
import noPageFound from '../assets/page-not-found.png';
import Detalles_cliente from './Detalles_clientes';

const Clientes = () => {
    // 1. Inicializamos como array vacío [] para evitar el uso de "!"
    const [persons, setPersons] = useState<Cliente[]>();
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const pageSize = 10;
    const [view, setView] = useState<{ mode: 'list' | ('form' | 'details'), data?: Cliente }>({ mode: 'list' });
    const totalPages = Math.ceil(totalRecords / pageSize);
    const offset = (currentPage - 1) * pageSize;
    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };
    const obtenerDatos = (parameters: any) => {
        apiObtenerClientes(parameters)
            .then((res: any) => {
                const data = res.data[0] || [];
                setTotalRecords(res.data[1][0].total)
                setPersons(data);
            })
            .catch(error => console.warn("no se pudieron obtener los datos", error))
            .finally(() => setLoading(false));
    }
    useEffect(() => {

        const parameters = {
            p_pageSize: pageSize,
            p_offset: offset
        }
        obtenerDatos(parameters)
    }, [currentPage]);

    // 2. useMemo: Solo filtra si cambia el buscador o la lista de personas
    const filteredPersons = useMemo(() => {
        return persons?.filter((p) =>
            p.nombres.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, persons]);

    const handleDelete = async (person: Cliente) => {
        if (person.id_cliente && confirm(`¿Eliminar a ${person.nombres} ${person.apellido_paterno} ${person.apellido_materno}?`)) {
            try {
                await apiEliminarCliente(person.id_cliente);
                setPersons(prev => prev?.filter(p => p.id_cliente !== person.id_cliente));
            } catch (error: any) {
                alert(error.message);
            }
        }
    };

    if (view.mode === 'form') {
        return <RegistroCliente
            cliente={view.data}
            onClose={() => {
                setView({ mode: 'list' });
                const parameters = {
                    p_pageSize: pageSize,
                    p_offset: offset
                }
                obtenerDatos(parameters)
            }}
        />;
    }

    if(view.mode === 'details')
    {
        if(view.data !== undefined){
           return <Detalles_cliente cliente={Number(view.data.id_cliente)} onClose={()=>setView({mode:'list'})}/>
        }
    }
    if (loading) return <div className='spinner_container'><Spinner /></div>;
    
    if (persons?.length === undefined) {
        return (
            <div className="spinner_container">
                <ImageComponent src={noPageFound} />
                <h3 style={{ color: "black" }}>No hay conexión con el servidor o la lista está vacía</h3>
            </div>
        );
    } 
    return (
        <div className="Screen_container">
            <div className="search_add_client_container">
                <input
                    type="text"
                    placeholder="Búsqueda de cliente"
                    className="search_client_input_screen"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="add_client" onClick={() => setView({ mode: 'form' })}>
                    <span className="texto_add_cliente">AGREGAR CLIENTE</span>
                </button>
            </div>

            <div className='header_estatico'>
                <Header_table_clients estatico>
                    <h1>Nombre</h1>
                    <h1>Fecha de nacimiento</h1>
                    <div style={{ width: "20%" }} />
                </Header_table_clients>
            </div>

            <div className="table_clients_container">
                {filteredPersons?.length !== 0 ?
                    filteredPersons?.map((person) => (
                        <Header_table_clients key={person.id_cliente}>
                            <h3 style={{fontWeight:"normal"}}>{`${person.nombres} ${person.apellido_paterno} ${person.apellido_materno}`}</h3>
                            <h3 style={{fontWeight:"normal"}}>{person.fecha_nacimiento}</h3>
                            <div className='buttons_container'>
                                <IconButton 
                                icono={<img src={'src/assets/details.png'} alt="View" />} 
                                funcion={() => {
                                    setView({mode:'details', data: person})
                                }} />
                                <IconButton
                                    icono={<img src={'src/assets/editar.png'} alt="Edit" />}
                                    funcion={() => setView({ mode: 'form', data: person })}
                                />
                                <IconButton
                                    icono={<img src={'src/assets/borrar.png'} alt="Delete" />}
                                    funcion={() => handleDelete(person)}
                                />
                            </div>
                        </Header_table_clients>
                    )) : <h1>SIN CLIENTES REGISTRADOS</h1>}
            </div>
            {totalPages > 1 ? (
                <div className="pagination_container">
                    {currentPage > 1 && (
                        <button onClick={handlePrev}>
                            Anterior
                        </button>
                    )}

                    {currentPage < totalPages && (
                        <button onClick={handleNext}>
                            Siguiente
                        </button>
                    )}
                </div>
            ) : null}

        </div>
    );
};

export default Clientes;