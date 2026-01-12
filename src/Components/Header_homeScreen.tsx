import React from "react";
import type { Cliente } from "../model/clientes_model";

interface Props {
  tabla?: boolean;
  children: React.ReactNode|React.ReactNode[];
  clienteData?: Cliente;
  funcion?: ()=>void
}

const Header_homeScreen = ({ tabla = false, children, clienteData, funcion}: Props) => {
  return !tabla ? (
    <div className="header_homeScreen">{children}</div>
  ) : (
    <div onClick={funcion} className="header_table">{children}</div>
  );
};

export default Header_homeScreen;
