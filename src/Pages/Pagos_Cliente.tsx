import Header_table_clients from '../Components/Header_table_clients';
import type { Pago } from '../model/pago';
import IconButton from '../Components/IconButton';
import closeIcon from '../assets/close.png'
import { useEffect, useState } from 'react';
import { apiObtenerPagosCliente } from '../API/api_clientes';
import Spinner from '../Components/spinner';
interface propsClientePagos {
    cliente?: {
        id_cliente: number;
        nombre_cliente: string;
    },
    onclose: () => void
}

const Pagos_Cliente = ({ cliente, onclose }: propsClientePagos) => {
    const [pagosCliente, setPagosCliente] = useState<Pago[]>()

    useEffect(() => {
        apiObtenerPagosCliente(cliente!.id_cliente).then((res: any) => {
            setPagosCliente(res.data[0]);
        })
    }, [])
    return pagosCliente?.length !== undefined ? <div className="Screen_container">
        <div className="header_pagos">
            <h1 style={{ color: "black" }}>Pagos Cliente: {cliente?.nombre_cliente}</h1>
            <IconButton icono={<img src={closeIcon} />} funcion={onclose} />
        </div>
        <div className='header_estatico'>
            <Header_table_clients estatico>
                <h3>CONCEPTO</h3>
                <h3>MONTO</h3>
                <h3>METODO DE PAGO</h3>
                <h3>FECHA</h3>
                <div />
            </Header_table_clients>
        </div>
        <div className="table_clients_container">
            {pagosCliente.length !== 0 ? pagosCliente.map((pago) => (
                <Header_table_clients key={pago.id_pago}>
                    <h3 style={{ fontWeight: "normal" }}>{pago.tipo}</h3>
                    <h3 style={{ fontWeight: "normal" }}>{`$${pago.monto}`}</h3>
                    <h3 style={{ fontWeight: "normal" }}>{pago.metodo_pago}</h3>
                    <h3 style={{ fontWeight: "normal" }}>{pago.fecha_pago}</h3>
                </Header_table_clients>
            )): <h1>Ningun pago realizado</h1>}
        </div>

    </div> : <div className='spinner_container'>
        <Spinner />
    </div>

}

export default Pagos_Cliente    