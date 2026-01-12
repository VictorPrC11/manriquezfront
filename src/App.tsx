import { useState } from 'react'
import './App.css'
import MenuButton from './Components/Menu_Button'
import Home_screen from './Pages/Home_screen';
import Clientes_screen from './Pages/Clientes_screen';
import Costos from './Pages/Costos';
import RegistroCliente from './Pages/Registro_cliente';


function App() {

  const [selectedButton, setSelectedButton] = useState("HOME");
  const handleButtonClick = (buttonLabel: string) => {

    setSelectedButton(buttonLabel);

  }

  return (
    <>
      <div className='background-overlay'>
        <div className='App'>

            <img src='src/assets/Logo.png' className='main-logo' alt='Logo Manriquez Gym' />

          <MenuButton label='HOME' isSelected={selectedButton == "HOME" ? true : false} onClick={
            () => {
              handleButtonClick("HOME")
             
            }
             
          } />
          <MenuButton label='CLIENTES' isSelected={selectedButton == "CLIENTES" ? true : false} onClick={() => {
            handleButtonClick("CLIENTES")
            
          }} />
          <MenuButton label='COSTOS' isSelected={selectedButton == "COSTOS" ? true : false} onClick={() => {
            handleButtonClick("COSTOS")
          }} />

        </div>

        {selectedButton === "HOME" && <Home_screen/>}
        {selectedButton === "CLIENTES" && <Clientes_screen/>}
        {selectedButton === "COSTOS" && <div/>}
      </div>
    </>
  )
}

export default App
