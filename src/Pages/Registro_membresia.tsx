import { useEffect, useState } from "react";
import CampoFormulario from "../Components/campoFormulario";
import type { Membresia } from "../model/membresia";
import { apiActualizarMembresia, apiCrearMembresia } from "../API/api_membresias";
interface propsMembresia {
    membresiaData? : Membresia
    onClose?: ()=>void
}
const Registro_membresia = ({membresiaData, onClose}:propsMembresia)=>{
    
    const ancho = 300;
    const [form, setForm] = useState({
        nombre: ''.toUpperCase(),
        costo: '',
        duracion_meses:''

    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,        // Copia lo que ya estaba en el form
            [name]: value   // Actualiza solo el campo que cambió
        });
    };
    const [errors, setErrors] = useState({
        nombre: '',
        costo: '',
        duracion_meses: ''
    });
    const validarCampos = () => {
        let nuevosErrores = {
            nombre: '',
            costo:'',
            duracion_meses: ''
        };
        let esValido = true;

        if (!form.nombre.trim()) {
            nuevosErrores.nombre = 'Obligatorio';
            esValido = false;
        }
        if (!form.costo.trim()) {
            nuevosErrores.costo = 'Obligatorio';
            esValido = false;
        }
        if (!form.duracion_meses.trim()) {
            nuevosErrores.duracion_meses = 'Obligatorio';
            esValido = false;
        }


        setErrors(nuevosErrores);
        return esValido;
    };
    const enviarForm = (e: any) => {
        const formulario_correcto = validarCampos();
        if (formulario_correcto) {
            if (formulario_correcto && !membresiaData && confirm("¿Los datos son correctos?")) {
                apiCrearMembresia(form)
                    .then(() => {
                        if (onClose) onClose();
                    }
                    ).catch((error) => {
                        alert(`Error al crear la membresia: ${error.message}`);
                    });

            }
        } else {
            e.preventDefault()
        }

        if (membresiaData) {
            console.log(form)
            apiActualizarMembresia(membresiaData.id_membresia!, form).then(() => {
                if (onClose) onClose();
            }
            ).catch((error) => {
                alert(`Error al actualizar membresia: ${error.message}`);
            });
        }

    }
    useEffect(() => {
        if (membresiaData) {
            setForm(membresiaData);
        }
    }, [membresiaData]);

    return <div className='Main-Container'>
        {membresiaData === undefined ? <h1 style={{ marginBottom: "50px" }}>REGISTRO DE MEMBRESIA</h1> : <h1 style={{ marginBottom: "50px" }}>ACTUALIZACION DE MEMBRESIA</h1> }
        <form onSubmit={enviarForm}>
            <div className='contenedor-1'>
                <CampoFormulario labelName="Nombre*" name='nombre' id='1' type='text' cambio={(e) => handleChange(e)} error={errors.nombre} value={form.nombre} />
                <CampoFormulario labelName='Costo*' name='costo' id='2' type='text' ancho={ancho} cambio={(e) => handleChange(e)} error={errors.costo} value={form.costo} />
                <CampoFormulario labelName='Duración (meses)*' name='duracion_meses' id='3' type='text' ancho={ancho} cambio={(e) => handleChange(e)} error={errors.duracion_meses} value={form.duracion_meses} />
            </div>
            <div style={{ marginTop: "40px", display: "flex", justifyContent: "center", width: "100%", flex: "1" }}>
                <button type='button' className='cancel' onClick={onClose}>Cancelar</button>
                <button className='enviar-form' type='submit'>Guardar</button>
            </div>
        </form>

    </div>
}
export default Registro_membresia