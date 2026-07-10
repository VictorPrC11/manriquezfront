import Papa from 'papaparse'
import { apiCrearCliente } from '../API/api_clientes';
import dayjs from "dayjs";
import type { MembresiaCliente } from '../model/membresias_cliente';
import type { Pago } from '../model/pago';
import { api_generaPago } from '../API/api_pagos';
import { apiCrearMembresiaCliente } from '../API/api_membresias_clientes';
import { apiCrearInscripcion } from '../API/api_membresias';
import noImage from "../assets/noImage.png"
export const procesarCSV  = async(
    nombreCsv: string, 
    idMembresia: number
)=>{
console.log(nombreCsv)
 const response = await fetch(nombreCsv)
 const texto = await response.text()
const blob = await (await fetch(noImage)).blob();

const fotoDefault = new File([blob],noImage, {
  type: blob.type,
});
    Papa.parse(texto, {
      header:false,

      complete: (resultado) => {

        resultado.data.forEach((fila:any) => {
            
         var nombreCompleto = separarNombreCompleto(fila[1])
         var metodoPago = formateoTipoDePago(fila[3].trim())
         var idCliente
         var fecha = formateoFecha(fila[0]).toString()
          var formData = new FormData()
         var datosCliente = {
                nombres: nombreCompleto.nombres,
                apellido_paterno: nombreCompleto.apellidoPaterno,
                apellido_materno: nombreCompleto.apellidoMaterno,
                fecha_nacimiento: fecha,
                celular: fila[2]  === "" ? 833 : fila[2],
                correo: "",
                direccion: "data",
                fecha_registro: fecha,
               
                
        }
         var datosPago = 
    {
        tipo: "INSCRIPCION + MEMBRESIA",
                notas: fila[5],
                monto: fila[4],
                metodo:metodoPago
    }
       
         Object.entries(datosCliente).forEach(([key, value]) => {
                if (value !== null) {
                    formData.append(key, value);
                }
            });
        formData.append("foto", fotoDefault);
        
        
       apiCrearCliente(formData).then((res: any)=>{
        const id = Number(res.data)
        idCliente = id
        var inscripcion: any = {
            id_cliente:idCliente!,
            nombre_membresia: "INSCRIPCION",
            fecha_inicio: datosCliente.fecha_registro,
        }
        var membresiaCliente: MembresiaCliente = {
                    id_cliente: idCliente!,
                    id_membresia: idMembresia,
                    fecha_inicio: datosCliente.fecha_registro,
                    pagado: 1,
                    activa: 1
                }
        
        var pagoGenerado: Pago = {
                        tipo: datosPago.tipo,
                        notas: datosPago.notas,
                        id_cliente: idCliente!,
                        monto: datosPago.monto,
                        metodo_pago: datosPago.metodo
                    }
       api_generaPago(pagoGenerado)
       apiCrearMembresiaCliente(membresiaCliente)
        apiCrearInscripcion(inscripcion)
        })
        
        
        });
        
        
      }
    });
}
const formateoTipoDePago = (tipodepago:any)=>{
    if(tipodepago.trim().toUpperCase() === "TERMINAL" || tipodepago.trim().toUpperCase() === "TRANSFERENCIA" || tipodepago.trim().toUpperCase() === "TRANFERENCIA"){
        return "TARJETA"
    }
    else{
        return tipodepago.trim().toUpperCase()
        }
}
const separarNombreCompleto = (nombreCompleto:String)=> {

  const partes = nombreCompleto
    .trim()
    .replace(/\s+/g, " ")
    .split(" ");

  var nombres = "";
  var apellidoPaterno = "";
  var apellidoMaterno = "";

  if (partes.length === 3) {
    nombres = partes[0].toUpperCase();
    apellidoPaterno = partes[1].toUpperCase();
    apellidoMaterno = partes[2].toUpperCase();
  }

  else if (partes.length === 4) {
    nombres = partes[0].toUpperCase() +' '+ partes [1].toUpperCase();
    apellidoPaterno = partes[2].toUpperCase();
    apellidoMaterno = partes[3].toUpperCase();
  }
  else if (partes.length === 5){
    nombres = partes[0].toUpperCase() +' '+ partes [1].toUpperCase();
    apellidoPaterno = partes[2].toUpperCase() +' '+ partes [3].toUpperCase();
    apellidoMaterno = partes[4].toUpperCase();
  }
  else if (partes.length === 6){
    nombres = partes[0].toUpperCase() +' '+ partes [1].toUpperCase() ;
    apellidoPaterno =  partes[2].toUpperCase() +' '+ partes [3].toUpperCase() +' '+ partes[4].toUpperCase();
    apellidoMaterno = partes[5].toUpperCase();
  }else{
    console.log("nombre invalido " + nombreCompleto)
  }
  return {
    nombres,
    apellidoPaterno,
    apellidoMaterno
  };
}
const formateoFecha= (fechaInvalida:any)=>{

    const fecha = dayjs(
  fechaInvalida,
  "DD MMMM YY"
);

if (!fecha.isValid()) {
   console.log("Fecha inválida:", fechaInvalida);
}
return fecha.format('YY-MM-DD')
}