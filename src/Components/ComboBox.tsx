import React, { useState } from 'react';
import Select, { type SingleValue } from 'react-select';

// 1. Definimos la interfaz para nuestras opciones
interface OptionType {
  value: string;
  label: string;
}
interface comboBoxProps{
    listData: OptionType[],
    etiqueta: string
}
const customStyles = {
  singleValue: (provided: any) => ({
    ...provided,
    color: "black", 
    fontWeight: 'bold',
  }),
  control: (provided:any)=>({
    ...provided,
    borderRadius: "8px",
    outline: "solid 1px black"
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    color: state.isSelected ? 'white' : state.isFocused ? "white" : '#0a4d78', 
    backgroundColor: state.isSelected ? '#0a4d78' : state.isFocused ? '#0a4d78':'white',
  }),
  // El texto del placeholder (opcional)
  placeholder: (provided: any) => ({
    ...provided,
    color: '#999',
    
  })
  
};

const ComboBox = ({listData, etiqueta}:comboBoxProps) => {
  const options: OptionType[] = listData

  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

  const handleChange = (newValue: SingleValue<OptionType>) => {
    setSelectedOption(newValue);
  };

  return (
    <Select
    styles={customStyles}
      value={selectedOption} 
      onChange={handleChange}
      options={options}
      isClearable 
      placeholder={etiqueta}
    />
  );
}

export default ComboBox;