import { useState } from 'react'
import './App.css'
import MenuButton from './Components/Menu_Button'
import Home_screen from './Pages/Home_screen';
import Pagos from './Pages/Pagos';
import Costos from './Pages/Costos';
import Clientes from './Pages/Clientes_screen';
import logoManriquez from './assets/Logo.png'
function App() {

  const [selectedButton, setSelectedButton] = useState("HOME");
  const handleButtonClick = (buttonLabel: string) => {

    setSelectedButton(buttonLabel);

  }

  return (
    <>
      <div className='background-overlay'>
        <div className='App'>

            <img src={logoManriquez} className='main-logo' alt='Logo Manriquez Gym' />

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

          <MenuButton label='PAGOS' isSelected={selectedButton == "PAGOS" ? true : false} onClick={()=>{
            handleButtonClick("PAGOS")
          }} />

        </div>
        {selectedButton === "HOME" && <Home_screen/>}
        {selectedButton === "CLIENTES" && <Clientes/>}
        {selectedButton === "COSTOS" && <Costos/>}
        {selectedButton == "PAGOS" && <Pagos/>}
      </div>
    </>
  )
}

export default App
