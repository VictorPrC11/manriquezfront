import { useEffect, useState } from 'react';
import CampoFormulario from '../Components/campoFormulario';
import { apiActualizarCliente, apiCrearCliente } from '../API/api_clientes';
import Pago_cliente from './Pago_cliente';

interface RegistroClienteProps {
    cliente?: any;
    onClose?: () => void;
}
const RegistroCliente = ({ onClose, cliente }: RegistroClienteProps) => {
    const [cobroScreen, setCobroScreen] = useState(false);
    const [idCliente, setIdCliente] = useState<any>(0);
    const [preview, setPreview] = useState<string | null>(null);
    const ancho = 300;

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
        if (formulario_correcto) {
            const hoy = new Date();
            const zonaHorariaOffset = hoy.getTimezoneOffset() * 60000;
            const fechaFormateada = new Date(hoy.getTime() - zonaHorariaOffset).toISOString().split('T')[0];
            form.fecha_registro = fechaFormateada;
            if (formulario_correcto && !cliente && confirm("¿Los datos son correctos?")) {
                const formData = new FormData();
                Object.entries(form).forEach(([key, value]) => {
                    if (value !== null) {
                        console.log(key, value);
                        formData.append(key, value);
                    }
                });
                apiCrearCliente(formData)
                    .then((res: any) => {
                        alert("Cliente creado exitosamente");
                        const id = Number(res.data);
                        setIdCliente(id);
                        setCobroScreen(true);
                    }
                    ).catch((error) => {
                        alert(`Error al crear el cliente: ${error.message}`);
                    });
            }
        }

        if (cliente) {
            apiActualizarCliente(cliente.id_cliente, form).then(() => {
                if (onClose) onClose();
            }
            ).catch((error) => {
                alert(`Error al actualizar el cliente: ${error.message}`);
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

    if (cobroScreen) {
        return <Pago_cliente cambio={() => {
            if (onClose) {
                onClose()
            }
            setCobroScreen(false)
        }} cliente={form} id_cliente={idCliente!} />
    }

    return <div className='Main-Container'>
        {cliente ? <h1 style={{ marginBottom: "50px" }}>ACTUALIZACION DE CLIENTE</h1> : <h1 style={{ marginBottom: "50px" }}>REGISTRO DE CLIENTE</h1>}
        <form onSubmit={enviarForm}>
            <div className='contenedor-1'>
                <CampoFormulario labelName="Nombres*" name='nombres' id='1' type='text' cambio={(e) => handleChange(e)} error={errors.nombres} value={form.nombres} />
                <CampoFormulario labelName='Apellido paterno*' name='apellido_paterno' id='2' type='text' ancho={ancho} cambio={(e) => handleChange(e)} error={errors.apellido_paterno} value={form.apellido_paterno} />
                <CampoFormulario labelName='Apellido materno*' name='apellido_materno' id='3' type='text' ancho={ancho} cambio={(e) => handleChange(e)} error={errors.apellido_materno} value={form.apellido_materno} />
            </div>
            <div className='separador'></div>
            <div className='contenedor-2'>
                <CampoFormulario labelName='Correo' name='correo' id='4' type='email' cambio={(e) => handleChange(e)} value={form.correo} />
                <CampoFormulario labelName='Celular' name='celular' id='5' type='number' ancho={ancho} cambio={(e) => handleChange(e)} value={form.celular} error={errors.celular} />
                <CampoFormulario labelName='Fecha de nacimiento*' name='fecha_nacimiento' id='6' type='date' ancho={ancho} cambio={(e) => handleChange(e)} error={errors.fecha_nacimiento} value={form.fecha_nacimiento} />
            </div>
            <div className='separador'></div>
            <div className='contenedor-3'>
                <CampoFormulario labelName='Dirección' name='direccion' id='7' type='text' ancho={ancho + 300} cambio={(e) => handleChange(e)} value={form.direccion} error={errors.direccion} />
                <CampoFormulario labelName='Foto' name='foto' id='8' type='file' ancho={ancho + 220} cambio={(e) => handleFileChange(e)} />
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