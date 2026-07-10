import { useEffect, useState } from "react";
import CampoFormulario from "../Components/campoFormulario";
import type { Membresia } from "../model/membresia";
import { apiActualizarMembresia, apiCrearMembresia } from "../API/api_membresias";
import ComboBox from "../Components/ComboBox";
import type { SingleValue } from "react-select";
import { toast, Toaster } from "sonner";

interface propsMembresia {
    membresiaData? : Membresia
    onClose?: ()=>void
}
interface OptionType {
    value: string;
    label: string;
}
const Registro_membresia = ({membresiaData, onClose}:propsMembresia)=>{
    const opcionesUnidad = [{value: 'DAY', label: 'DIAS'},{value:'MONTH', label: 'MESES'}]
    const ancho = 300;
    const [form, setForm] = useState({
        nombre: ''.toUpperCase(),
        costo: '',
        duracion:'',
        unidad: ''

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
        duracion: '',
        unidad:''
    });
    const validarCampos = () => {
        let nuevosErrores = {
            nombre: '',
            costo:'',
            duracion: '',
            unidad:''
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
        if (!form.duracion.trim()) {
            nuevosErrores.duracion = 'Obligatorio';
            esValido = false;
        }
        if(!form.unidad.trim()){
            nuevosErrores.unidad='Obligatorio'
            esValido = false
        }

        setErrors(nuevosErrores);
        return esValido;
    };
   const enviarForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formulario_correcto = validarCampos();
    if (!formulario_correcto) {
        toast.warning('Completa todos los campos');
        return;
    }

    try {
        if (membresiaData) {
            await apiActualizarMembresia(membresiaData.id_membresia!, form);
            toast.success("Membresía actualizada correctamente");
        } else {
            await apiCrearMembresia(form);
        }

        if (onClose) onClose();

    } catch (error: any) {
        toast.error(`Error: ${error.message}`);
    }
};
    const handleSelectChange  = (name: string, selection: SingleValue<OptionType>) => {
            setForm({
                ...form,
                [name]: selection ? selection.value : ""
            });
            
        };
    
    useEffect(() => {
        if (membresiaData) {
            setForm(membresiaData);
        }
    }, [membresiaData]);

    return <div className='Main-Container'>
        <Toaster position="top-center"/>
        {membresiaData === undefined ? <h1 style={{ marginBottom: "50px" }}>REGISTRO DE MEMBRESIA</h1> : <h1 style={{ marginBottom: "50px" }}>ACTUALIZACION DE MEMBRESIA</h1> }
        <form onSubmit={enviarForm}>
            <div className='contenedor-1'>
                <CampoFormulario labelName="Nombre*" name='nombre' id='1' type='text' cambio={(e) => handleChange(e)} error={errors.nombre} value={form.nombre} />
                <CampoFormulario labelName='Costo*' name='costo' id='2' type='text' ancho={ancho} cambio={(e) => handleChange(e)} error={errors.costo} value={form.costo} />
                
            </div>
            <div className="separador"></div>
            <div className="contenedor-1"> 
                <CampoFormulario labelName='Duración*' name='duracion' id='3' type='text' cambio={(e) => handleChange(e)} error={errors.duracion} value={form.duracion} />
                <ComboBox cambio={(valor) => handleSelectChange("unidad", valor)}
                    valor={opcionesUnidad.find(opt => opt.value === form.unidad) || null}
                    name='unidad'
                    listData={opcionesUnidad}
                    etiqueta='Unidad'
                    titulo="Unidad de medida*"
                     />
            </div>
            <div style={{ marginTop: "40px", display: "flex", justifyContent: "center", width: "100%", flex: "1" }}>
                <button type='button' className='cancel' onClick={onClose}>Cancelar</button>
                <button className='enviar-form' type='submit'>Guardar</button>
            </div>
        </form>

    </div>
}
export default Registro_membresia