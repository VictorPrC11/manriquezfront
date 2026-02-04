import React, { useState } from 'react';
import Select, { type SingleValue } from 'react-select';

// 1. Definimos la interfaz para nuestras opciones
interface OptionType {
  value: string;
  label: string;
}
interface comboBoxProps {
  listData: OptionType[];
  etiqueta: string;
  titulo: string;
  ancho?: boolean;
  name: string;
  cambio: (newValue: SingleValue<OptionType>) => void;
  valor: OptionType | null; // Es mejor pasar el objeto completo o null
}

const ComboBox = ({ listData, etiqueta, titulo, ancho, name, cambio, valor }: comboBoxProps) => {

  const customStyles = {
    singleValue: (provided: any) => ({
      ...provided,
      color: "black",
      fontWeight: "bold",
      lineHeight: "1",
    }),

    control: (provided: any) => ({
      ...provided,
      borderRadius: "8px",
      outline: "solid 0.8px black",
      minHeight: "30px",
      height: "30px",
      minWidth: "180px",
      width: ancho ? "250px" : "300px"
    }),

    valueContainer: (provided: any) => ({
      ...provided,
      padding: "0px",
    }),

    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: "30px",
    }),


    dropdownIndicator: (provided: any) => ({
      ...provided,
      padding: 4,
    }),

    clearIndicator: (provided: any) => ({
      ...provided,
      padding: 4,
    }),

    option: (provided: any, state: any) => ({
      ...provided,
      color: state.isSelected
        ? "white" : "#0a4d78",
      backgroundColor: state.isSelected
        ? "#0a4d78"
        : "white",
    }),

    placeholder: (provided: any) => ({
      ...provided,
      color: "#999",
      lineHeight: "1",
    }
    )
  }
  const options: OptionType[] = listData
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", flexDirection: "column" }}>
      <label style={{ color: "grey", fontSize: "20px", fontWeight: "lighter" }}>{titulo}</label>
      <div style={{ height: "8px" }} />
      <Select
        name={name}
        styles={customStyles}
        value={valor}
        onChange={cambio}
        options={options}
        isClearable
        placeholder={etiqueta}
      />
    </div >

  );
}

export default ComboBox;