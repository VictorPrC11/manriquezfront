import { useEffect, useRef, useState } from 'react';
import CampoFormulario from '../Components/campoFormulario';
import { apiActualizarCliente, apiCrearCliente } from '../API/api_clientes';
import Pago_cliente from './Pago_cliente';
import { toast, Toaster } from 'sonner'
interface RegistroClienteProps {
    cliente?: any;
    onClose?: () => void;
}
const RegistroCliente = ({ onClose, cliente }: RegistroClienteProps) => {

    const firstCheckRender = useRef(true)
    const [cobroScreen, setCobroScreen] = useState(false);
    const [idCliente, setIdCliente] = useState<any>(0);
    const [preview, setPreview] = useState<string | null>(null);
    const [check, setCheck] = useState(false);
    const ancho = 300;
    const [dataResponseClient, setDataResponseClient] = useState([])
    const [form, setForm] = useState({
        nombres: ''.trim(),
        apellido_paterno: ''.trim(),
        apellido_materno: ''.trim(),
        correo: ''.trim(),
        celular: ''.trim(),
        fecha_nacimiento: '',
        direccion: ''.trim(),
        fecha_registro: '',
        foto: null as File | null
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,        // Copia lo que ya estaba en el form
            [name]: value   // Actualiza solo el campo que cambió
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm({ ...form, foto: file });
            setPreview(URL.createObjectURL(file)); // Crea vista previa temporal
        }
    };

    const [errors, setErrors] = useState({
        nombres: '',
        apellido_paterno: '',
        apellido_materno: '',
        fecha_nacimiento: '',
        celular: '',
        direccion: ''
    });

    const validarCampos = () => {
        let nuevosErrores = {
            nombres: '',
            apellido_paterno: '',
            apellido_materno: '',
            fecha_nacimiento: '',
            celular: '',
            direccion: '',
            foto: ''
        };

        let esValido = true;

        if (!form.nombres.trim()) {
            nuevosErrores.nombres = 'Obligatorio';
            esValido = false;
        }
        if (!form.apellido_paterno.trim()) {
            nuevosErrores.apellido_paterno = 'Obligatorio';
            esValido = false;
        }
        if (!form.apellido_materno.trim()) {
            nuevosErrores.apellido_materno = 'Obligatorio';
            esValido = false;
        }
        if (!form.fecha_nacimiento.trim()) {
            nuevosErrores.fecha_nacimiento = 'Obligatorio';
            esValido = false;
        }

        if (!form.celular.trim()) {
            nuevosErrores.celular = 'Obligatorio';
            esValido = false;
        }

        if (!form.direccion.trim()) {
            nuevosErrores.direccion = 'Obligatorio';
            esValido = false;
        }

        setErrors(nuevosErrores);
        return esValido;
    };

    const enviarForm = (e: any) => {
        e.preventDefault()
        const formulario_correcto = validarCampos();
        if (!formulario_correcto) {
            toast.error("Por favor completa los campos obligatorios")
            return;
        }
        const hoy = new Date();
        const zonaHorariaOffset = hoy.getTimezoneOffset() * 60000;
        const fechaFormateada = new Date(hoy.getTime() - zonaHorariaOffset).toISOString().split('T')[0];

        if (!check && form.fecha_registro === '') {
            form.fecha_registro = fechaFormateada;
        }
        if (check && form.fecha_registro === '') {
            toast.error("Debes seleccionar una fecha de registro anterior o desactivar la casilla para usar la fecha actual")
            return;
        }

        if (!cliente) {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (value !== null) {
                    formData.append(key, value);
                }
            });
            apiCrearCliente(formData)
                .then((res: any) => {
                    toast.success("Cliente creado exitosamente");
                    const id = Number(res.data.id_cliente);
                    setDataResponseClient(res.data)
                    setIdCliente(id);
                    setCobroScreen(true);
                }
                ).catch((error) => {
                    toast.error(`Error al crear el cliente: ${error.message}`);
                });
        }

        if (cliente) {
            apiActualizarCliente(cliente.id_cliente, form).then(() => {
                toast.success("Cliente actualizado exitosamente");
                if (onClose) onClose();
            }
            ).catch((error) => {
                toast.error(`Error al actualizar el cliente: ${error.message}`);
            });
        }

    }

    useEffect(() => {
        if (cliente) {
            setForm({
                nombres: cliente.nombres,
                apellido_paterno: cliente.apellido_paterno,
                apellido_materno: cliente.apellido_materno,
                fecha_nacimiento: cliente.fecha_nacimiento,
                celular: cliente.celular,
                correo: cliente.correo ? cliente.correo : "",
                direccion: cliente.direccion,
                fecha_registro: cliente.fecha_registro,
                foto: null
            });
        }
    }, [cliente]);
    useEffect(() => {
        if (firstCheckRender.current) {
            firstCheckRender.current = false;
            console.log("Primer renderizado del check, no mostrar toast")
            return;
        }
        if (check) {
            toast("Fecha de registro anterior activada, no se registrará la fecha actual al guardar", {
                description: "Asegúrate de ingresar la fecha de registro correcta en el campo correspondiente",
                duration: 5000
            })

        } else {
            toast("Fecha de registro anterior desactivada, se registrará la fecha actual al guardar", {
                description: `El registro del cliente se realizará con la fecha actual ${new Date().toISOString().split('T')[0]}, asegúrate de activar la casilla si deseas usar una fecha de registro anterior`,
                duration: 8000
            })
            setForm(prev => ({ ...prev, fecha_registro: '' }))
        }
    }, [check])


    if (cobroScreen) {
        return <Pago_cliente cambio={() => {
            if (onClose) {
                onClose()
            }

            setCobroScreen(false)
        }} cliente={dataResponseClient} id_cliente={idCliente!} typeScreen={"REGISTRO"} />
    }

    return <div className='Main-Container'>
        <Toaster position='top-center' closeButton />
        {cliente ? <h1 style={{ marginBottom: "50px" }}>ACTUALIZACION DE CLIENTE</h1> : <h1 style={{ marginBottom: "50px" }}>REGISTRO DE CLIENTE</h1>}
        <form onSubmit={enviarForm}>
            <div className='contenedor-1'>
                <CampoFormulario labelName="Nombres*" name='nombres' id='1' type='text' cambio={(e) => handleChange(e)} error={errors.nombres} value={form.nombres} />
                <CampoFormulario labelName='Apellido paterno*' name='apellido_paterno' id='2' type='text' ancho={ancho} cambio={(e) => handleChange(e)} error={errors.apellido_paterno} value={form.apellido_paterno} />
                <CampoFormulario labelName='Apellido materno*' name='apellido_materno' id='3' type='text' ancho={ancho} cambio={(e) => handleChange(e)} error={errors.apellido_materno} value={form.apellido_materno} />
            </div>
            <div className='separador'></div>
            <div className='contenedor-2'>
                {/*<CampoFormulario labelName='Correo' name='correo' id='4' type='email' cambio={(e) => handleChange(e)} value={form.correo} />*/}
                <CampoFormulario labelName='Dirección' name='direccion' id='4' type='text' cambio={(e) => handleChange(e)} value={form.direccion} error={errors.direccion} />
                <CampoFormulario labelName='Celular' name='celular' id='5' type='number' ancho={ancho} cambio={(e) => handleChange(e)} value={form.celular} error={errors.celular} />
                <CampoFormulario labelName='Fecha de nacimiento*' name='fecha_nacimiento' id='6' type='date' ancho={ancho} cambio={(e) => handleChange(e)} error={errors.fecha_nacimiento} value={form.fecha_nacimiento} />
            </div>
            <div className='separador'></div>
            <div className='contenedor-3'>
                <CampoFormulario labelName='Foto' name='foto' id='7' type='file' ancho={ancho + 220} cambio={(e) => handleFileChange(e)} />
                <input type="checkbox" style={{
                    height: "22px",
                    width: "22px",
                    alignSelf:'center'
                    , marginTop:"20px",
                    marginLeft:"20px"
                }} name='fechaAnterior' checked={check} onChange={(e) => {
                    setCheck(e.target.checked)

                }} />
                {
                    check ?
                        <CampoFormulario labelName='Fecha de registro pasada' name='fecha_registro' id='9' type='date' ancho={ancho} cambio={(e) => handleChange(e)} value={form.fecha_registro} />
                        : <span style={{ fontSize: "18px", color: "gray", alignSelf:'center', margin:"20px 60px 0px 0px"}}>¿Fecha de registro anterior?</span>
                }
                
            </div>
            <div style={{ marginTop: "40px", display: "flex", justifyContent: "center", width: "100%", flex: "1" }}>
                <button type='button' className='cancel' onClick={() => {
                    if (onClose)
                        onClose()
                }}>Cancelar</button>
                <button className='enviar-form' type='submit'>Guardar</button>
            </div>

        </form>
        {preview && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <h3>Vista previa de la foto seleccionada:</h3>
                <img src={preview} alt="Vista previa" style={{ maxWidth: "200px", maxHeight: "200px" }} />
            </div>
        )}

    </div>
}

export default RegistroCliente