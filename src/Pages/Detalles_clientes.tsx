import { useEffect, useState } from "react";
import CampoFormulario from "../Components/campoFormulario";
import ImageComponent from "../Components/imageComponent";
import { apiEliminarCliente, apiObtenerDetallesCliente } from "../API/api_clientes";
import Spinner from "../Components/spinner";
import IconButton from "../Components/IconButton";
import Pagos_Cliente from "./Pagos_Cliente";
import RegistroCliente from "./Registro_cliente";
import type { Cliente } from "../model/clientes_model";
import editar from '../assets/editar.png'
import borrar from '../assets/borrar.png'
import Pago_cliente from "./Pago_cliente";



interface detallesClienteProps {
    cliente: number;
    onClose: () => void
}
type TypeOperation = "RENOVACION_MEMBRESIA" | "RENOVACION_INSCRIPCION" | "REGISTRO" | "RENOVACION_MI";
const URL_BASE = "http://localhost:3000/uploads/";
const Detalles_cliente = ({ cliente, onClose }: detallesClienteProps) => {
    const ancho = 210;
    const ancho1 = 300;
    const [loading, setLoading] = useState(true)
    const [pagosScreen, setPagosScreen] = useState(false)
    const [updateScreen, setUpdateScreen] = useState(false)
    const [typeRenew, setType] = useState<TypeOperation>()
    const [renewMembership, setRenew] = useState(false)
    const [form, setForm] = useState({
        nombres: '',
        apellido_paterno: '',
        apellido_materno: '',
        correo: '',
        celular: '',
        fecha_nacimiento: '',
        direccion: '',
        membresia: '',
        membresia_activa: '',
        inscripcion_activa: '',
        vencimiento_membresia: '',
        vencimiento_inscripcion: '',
        foto: ''
    });

    const obtenerDatosCliente = (id_cliente: any) => {
        apiObtenerDetallesCliente(id_cliente).then((res: any) => {
            setForm(() => ({
                nombres: res.data[0][0].nombres ? res.data[0][0].nombres : "",
                apellido_paterno: res.data[0][0].apellido_paterno ? res.data[0][0].apellido_paterno : "",
                apellido_materno: res.data[0][0].apellido_materno ? res.data[0][0].apellido_materno : "",
                correo: res.data[0][0].correo ? res.data[0][0].correo : "",
                celular: res.data[0][0].celular ? res.data[0][0].celular : "",
                fecha_nacimiento: res.data[0][0].fecha_nacimiento ? res.data[0][0].fecha_nacimiento : "",
                direccion: res.data[0][0].direccion ? res.data[0][0].direccion : "",
                membresia: res.data[0][0].membresia_activa ? res.data[0][0].nombre : "INACTIVA",
                membresia_activa: res.data[0][0].membresia_activa,
                inscripcion_activa: res.data[0][0].inscripcion_activa,
                vencimiento_membresia: res.data[0][0].membresia_activa ? res.data[0][0].vencimiento_membresia : "SIN DATOS",
                vencimiento_inscripcion: res.data[0][0].inscripcion_activa ? res.data[0][0].vencimiento_inscripcion : "INACTIVA",
                foto: res.data[0][0].foto ? `${URL_BASE}${res.data[0][0].foto}` : "undefined"
            }));

            setLoading(false);

        }).catch((error) => {
            console.warn("error: " + error)
        })
    }
    const handleDelete = async (id_cliente: number) => {
        if (id_cliente && confirm(`¿Eliminar a ${form.nombres} ${form.apellido_paterno} ${form.apellido_materno}?`)) {
            try {
                await apiEliminarCliente(id_cliente);
                onClose();
            } catch (error: any) {
                alert(error.message);
            }
        }
    }
    useEffect(() => {
        if (!form.membresia_activa && !form.inscripcion_activa) {
            setType('RENOVACION_MI')
            return
        }
        if (!form.membresia_activa) {
            setType('RENOVACION_MEMBRESIA')
            return
        }
        if (!form.inscripcion_activa) {
            setType('RENOVACION_INSCRIPCION')
            return
        }
    }, [form.membresia_activa, form.inscripcion_activa]);
    useEffect(() => {
        obtenerDatosCliente(cliente)
    }, [cliente]);

    if (pagosScreen) {
        return <Pagos_Cliente onclose={() => setPagosScreen(false)} cliente={{
            id_cliente: cliente,
            nombre_cliente: `${form.nombres} ${form.apellido_paterno} ${form.apellido_materno}`
        }} />
    }
    if (updateScreen) {
        const dataCliente: Cliente = {
            nombres: form.nombres,
            apellido_paterno: form.apellido_paterno,
            apellido_materno: form.apellido_materno,
            correo: form.correo ? form.correo : "",
            direccion: form.direccion ? form.direccion : "",
            celular: form.celular,
            fecha_nacimiento: form.fecha_nacimiento,
            fecha_registro: ""
        }
        return <RegistroCliente cliente={dataCliente} onClose={() => {
            obtenerDatosCliente(cliente)
            setUpdateScreen(false)
        }} />
    }
    if (renewMembership) {
        return <Pago_cliente typeScreen={typeRenew} cambio={() => {
            obtenerDatosCliente(cliente)
            setRenew(false)
        }} id_cliente={cliente} cliente={form} />
    }
    return loading ? <div className="spinner_container"><Spinner /></div> :
        <div className='Main-Container'>
            <h1 style={{ marginBottom: "50px" }}>DATOS CLIENTE</h1>
            <div className="row">
                <div className='column'>
                    <div className='row-1'>
                        <CampoFormulario lectura labelName="Nombre" name='nombres' id='1' type='text' ancho={ancho1} value={`${form.nombres} ${form.apellido_paterno} ${form.apellido_materno}`} />
                        <CampoFormulario lectura labelName='Celular' name='celular' id='2' type='text' ancho={ancho} value={form.celular} />
                        <CampoFormulario lectura labelName='Fecha de nacimiento' name='fecha_nacimiento' id='3' type='date' ancho={ancho} value={form.fecha_nacimiento} />
                    </div>
                    <div className="separador" />
                    <div className='row-1'>
                        <CampoFormulario lectura labelName="Correo" name='correo' id='4' type='text' ancho={ancho1} value={form.correo} />
                        <CampoFormulario lectura labelName='Membresia' name='membresia' id='5' type='text' ancho={ancho} value={form.membresia} />
                        <CampoFormulario lectura labelName='Vencimiento' name='vencimiento_membresia' id='6' type='text' ancho={ancho} value={form.vencimiento_membresia} />
                    </div>
                    <div className="separador" />
                    <div className='row-1'>
                        <CampoFormulario lectura labelName='Dirección' name='direccion' id='7' type='text' ancho={ancho1 + ancho + 20} value={form.direccion} />
                        <CampoFormulario lectura labelName='Inscripción' name='vencimiento_inscripcion' id='8' type='text' ancho={ancho} value={form.vencimiento_inscripcion} />
                    </div>
                </div>
                <div style={{ width: "30px" }} />
                <div className="column">

                    <ImageComponent width={210} height={250} src={form.foto} />
                    <div className="row-1">
                        <IconButton
                            icono={<img src={editar} alt="Editar" />}
                            funcion={() => {
                                setUpdateScreen(true)
                            }}
                        />
                        <IconButton
                            icono={<img src={borrar} alt="Borrar" />}
                            funcion={() => handleDelete(cliente)}
                        />
                        <button className="textButton" onClick={() => setPagosScreen(true)}><label>Pagos</label></button>
                    </div>

                </div>

            </div>
            <div style={{ marginTop: "40px", display: "flex", justifyContent: "center", width: "100%", flex: "1", gap: "20px" }}>
                {!form.membresia_activa || !form.inscripcion_activa || form.inscripcion_activa === null || form.membresia_activa === null ? <button className="enviar-form" onClick={() => {
                    setRenew(true)
                }
                }>Renovar</button> : undefined}
                <button type='button' className='cancel' onClick={onClose}>Cancelar</button>
            </div>

        </div>


}




export default Detalles_cliente;