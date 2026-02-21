import { useEffect, useState } from "react";
import CampoFormulario from "../Components/campoFormulario"
import ComboBox from "../Components/ComboBox";
import type { SingleValue } from "react-select";
import { apiCrearInscripcion, apiObtenerInscripcion, apiObtenerMembresias, apiRegistrarClienteTBInscripciones } from '../API/api_membresias';
import type { Membresia } from "../model/membresia";
import { api_generaPago } from "../API/api_pagos";
import type { Pago } from "../model/pago";
import type { MembresiaCliente } from "../model/membresias_cliente";
import { apiActualizarInscripcionCliente, apiActualizarMembresiaCliente, apiCrearMembresiaCliente } from '../API/api_membresias_clientes';
interface OptionType {
    value: string;
    label: string;
}
type TypeOperation = "RENOVACION_MEMBRESIA" | "RENOVACION_INSCRIPCION" | "REGISTRO" | "RENOVACION_MI" | undefined;
interface PagoProp {
   typeScreen : TypeOperation;
    cambio: () => void;
    cliente?: any;
    id_cliente: number;
}

const Pago_cliente = ({ cambio, cliente, id_cliente,typeScreen}: PagoProp) => {
    const hoy = new Date();
    const fechaInicio =
        hoy.getFullYear() + '-' +
        String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
        String(hoy.getDate()).padStart(2, '0');

    const [costoMembresia, setCostoMembresia] = useState(0)
    const [costoInscripcion, setCostoInscripcion] = useState(0)
    const [membresias, setMembresias] = useState<Membresia[]>([])
    const [datosInscripcion, setDatosInscripcion] = useState<Membresia>()
    const [opcionesMembresias, setOpcionesMembresias] = useState<OptionType[]>([])
    const opcionesMetodoPago = [{ value: "EFECTIVO", label: "EFECTIVO" }, { value: "TARJETA", label: "TARJETA" }, { value: "TRANSFERENCIA", label: "TRANSFERENCIA" }]
    const opcionesInscripciones = [
        { value: "PAGADO", label: "PAGADO" }, { value: "NO PAGADO", label: "NO PAGADO" }, { value: "GRATIS", label: "GRATIS" }
    ]
    const ancho = 250;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDatos({
            ...datos,        // Copia lo que ya estaba en el form
            [name]: value   // Actualiza solo el campo que cambió
        });
    };
    const [datos, setDatos] = useState(
        {
            id_cliente: 0,
            nombres: "",
            apellido_paterno: "",
            apellido_materno: "",
            inscripcion: "",
            membresia: "",
            metodoPago: "",
            Notas: "",
            tipo: "",
            Total: 0,

        }
    )
    const handleSelectChange = (name: string, selection: SingleValue<OptionType>) => {
        setDatos({
            ...datos,
            [name]: selection ? selection.value : ""
        });
    };

    useEffect(() => {
        apiObtenerMembresias().then((res: any) => {
            setMembresias(res.data[0])
            setOpcionesMembresias(res.data[0].map((e: any) => ({
                value: e.nombre,
                label: e.nombre
            })))

        }).catch(error => {
            alert(`Error al obtener membresias: ${error.message}`);
        });
        apiObtenerInscripcion().then((res: any) => {
            setDatosInscripcion(res.data[0])
        }
        ).catch(error => {
            alert(`Error al obtener inscripcion: ${error.message}`);
        }
        );
    }, [])
    useEffect(() => {
        if (cliente) {
            setDatos((prev) => ({
                ...prev,
                id_cliente: id_cliente,
                nombres: cliente.nombres.trim(),
                apellido_paterno: cliente.apellido_paterno.trim(),
                apellido_materno: cliente.apellido_materno.trim()
            }))
        }
    }, [])

    useEffect(() => {
        let totalCalculado = 0;
        let nuevoTipo = "";

        if (datos.membresia) {
            totalCalculado += costoMembresia;
            nuevoTipo = "MEMBRESIA";
        }

        if (datos.inscripcion === "PAGADO" || datos.inscripcion === "GRATIS") {
            totalCalculado += costoInscripcion;
            nuevoTipo = nuevoTipo
                ? "INSCRIPCION + MEMBRESIA"
                : "INSCRIPCION";
        }

        setDatos(prev => ({
            ...prev,
            Total: totalCalculado,
            tipo: nuevoTipo
        }));

    }, [costoMembresia, costoInscripcion, datos.membresia, datos.inscripcion]);

    const manejarCambioMembresia = (valor: SingleValue<OptionType>) => {
        handleSelectChange('membresia', valor);
        if (valor) {
            const opcion = membresias.find(opt => opt.nombre === valor.label);
            setCostoMembresia(Number(opcion?.costo) || 0);

        } else {
            setCostoMembresia(0);
        }
    };

    const manejarCambioInscripcion = (valor: SingleValue<OptionType>) => {
        handleSelectChange('inscripcion', valor);
        if (valor?.value === "PAGADO") {
            setCostoInscripcion(Number(datosInscripcion?.costo))
        } else {
            setCostoInscripcion(0);
        }
    };
    const registrarMembresiaCliente = () => {
        const duracion_membresia = membresias.find(opt => opt.nombre === datos.membresia)
        const membresiaCliente: MembresiaCliente = {
            id_cliente: Number(datos.id_cliente),
            id_membresia: Number(duracion_membresia!.id_membresia),
            fecha_inicio: fechaInicio,
            pagado: 1,
            activa: 1
        }
        return membresiaCliente
    }
    const registrarInscripcion = () => {

        const inscripcion: any = {
            id_cliente: Number(datos.id_cliente),
            nombre_membresia: "INSCRIPCION",
            fecha_inicio: fechaInicio,
        }
        return inscripcion
    }

    const enviarForm = () => {
        if (!datos.membresia && (datos.inscripcion !== "PAGADO" && datos.inscripcion !== "GRATIS")) {
            alert("Debe seleccionar una membresia o pagar la inscripcion para generar el pago");
            return;
        }
        if (confirm("Desea registrar el cobro?")) {
            const pagoGenerado: Pago = {
                tipo: datos.tipo,
                notas: datos.Notas,
                id_cliente: Number(datos.id_cliente),
                monto: datos.Total,
                metodo_pago: datos.metodoPago
            }
            if (typeScreen === "RENOVACION_MEMBRESIA") {
                const generarMembresiaCliente = registrarMembresiaCliente();
                apiActualizarMembresiaCliente(generarMembresiaCliente).then(() => {
                    api_generaPago(pagoGenerado);
                    cambio()
                }).catch((error) => {
                    alert(`Error al renovar membresia: ${error.message}`);
                });
            }
            if (typeScreen === "RENOVACION_INSCRIPCION") {
                const generarInscripcion = registrarInscripcion();
                apiActualizarInscripcionCliente(generarInscripcion).then(() => {
                    api_generaPago(pagoGenerado);
                    cambio()
                }
                ).catch((error) => {
                    alert(`Error al renovar inscripcion: ${error.message}`);
                }
                );
            }
            if (typeScreen === "REGISTRO" || typeScreen === "RENOVACION_MI") {
                const generarMembresiaCliente = registrarMembresiaCliente();
                const generarInscripcion = registrarInscripcion();
                api_generaPago(pagoGenerado);
                apiCrearMembresiaCliente(generarMembresiaCliente)
                if (datos.inscripcion === "PAGADO" || datos.inscripcion === "GRATIS") {
                    apiCrearInscripcion(generarInscripcion)
                    
                }else{
                    apiRegistrarClienteTBInscripciones(generarInscripcion);
                }
                cambio()
            }
        }

    }
    return <div className="contenedor_pantalla_pago">
        <div className="contenedor_principal">
            <h1 style={{ marginBottom: "50px" }}>REGISTRO DE PAGO</h1>
            <form></form>
            <div className="contenedor-pago">
                <CampoFormulario lectura labelName="Cliente" name='nombres' id='1' type='text' ancho={ancho} cambio={(e) => handleChange(e)} value={`${datos.nombres} ${datos.apellido_paterno} ${datos.apellido_materno}`} />

                {
                    typeScreen === "RENOVACION_INSCRIPCION" ?
                        <ComboBox cambio={(valor) => {
                            manejarCambioInscripcion(valor)
                        }}
                            valor={opcionesInscripciones.find(opt => opt.value === datos.inscripcion) || null}
                            name='inscripcion'
                            listData={opcionesInscripciones}
                            etiqueta='Inscripcion'
                            titulo="Inscripcion"
                            ancho />
                        : typeScreen === "RENOVACION_MEMBRESIA" ?
                            <ComboBox cambio={(valor) => {
                                manejarCambioMembresia(valor)
                            }}
                                valor={opcionesMembresias.find(opt => opt.value === datos.membresia) || null}
                                name='membresia'
                                listData={opcionesMembresias}
                                etiqueta='Membresia'
                                titulo="Tipo de membresia"
                                ancho /> :
                            <>
                                <ComboBox cambio={(valor) => {
                                    manejarCambioInscripcion(valor)
                                }}
                                    valor={opcionesInscripciones.find(opt => opt.value === datos.inscripcion) || null}
                                    name='inscripcion'
                                    listData={opcionesInscripciones}
                                    etiqueta='Inscripcion'
                                    titulo="Inscripcion"
                                    ancho />
                                <ComboBox cambio={(valor) => {
                                    manejarCambioMembresia(valor)
                                }}
                                    valor={opcionesMembresias.find(opt => opt.value === datos.membresia) || null}
                                    name='membresia'
                                    listData={opcionesMembresias}
                                    etiqueta='Membresia'
                                    titulo="Tipo de membresia"
                                    ancho />
                            </>
                }
                <ComboBox cambio={(valor) => handleSelectChange("metodoPago", valor)}
                    valor={opcionesMetodoPago.find(opt => opt.value === datos.metodoPago) || null}
                    name='metodoPago'
                    listData={opcionesMetodoPago}
                    etiqueta='Pago'
                    titulo="Metodo de pago"
                    ancho />
            </div>
            <div className="separador"></div>
            <div className="contenedor-pago">
                <CampoFormulario alto labelName="Notas" name='Notas' id='2' type='text' ancho={855} cambio={(e) => handleChange(e)} value={datos.Notas} />
                <CampoFormulario alto labelName="Total" name='Total' id='3' type='number' ancho={ancho} cambio={(e) => handleChange(e)} value={isNaN(datos.Total) ? "0" : datos.Total.toString()} />
            </div>
            <div className="separador"></div>
            <div className="contenedor-pago" style={{ justifyContent: "flex-end", marginRight: "15px" }}>
                {typeScreen==='RENOVACION_INSCRIPCION' || typeScreen==='RENOVACION_MEMBRESIA' || typeScreen === 'RENOVACION_MI' ? <button type='button' className='cancel' style={{width: '100px'}} onClick={cambio}>Cancelar</button> : null}
                <button type="button" className="enviar-form" style={{ width: "100px" }} onClick={() => enviarForm()}>Cobrar</button>
            </div>
        </div>
    </div>
}

export default Pago_cliente