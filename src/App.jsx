import { useState } from "react"
import Header from "./components/Header"
import PokeCard  from "./components/PokeCard"
import SideNav  from "./components/SideNav"

function App() {
  // we are adding this use state in the app as we need the selected pokemon in the nav bar so that we can get the data for that particular Pokemon in the Pokecard component
   const [ selectedPokemon, setSelectedPokemon ] = useState(0)
  // This is a statefull variable to access the side menu when the menu in the mobile mode is clicked
   const [showSideMenu, setShowSideMenu] = useState(false)

   function handleToggleMenu(){
    setShowSideMenu(!showSideMenu) //reverses the state which is set to the false
   }

   function handleCloseMenu(){
    setShowSideMenu(false)
   }
  return (
    <>
      <Header handleToggleMenu={handleToggleMenu} />
      {/*Getting the setSelected pokemon from the side nav*/}
      <SideNav 
      showSideMenu={showSideMenu}
      handleCloseMenu={handleCloseMenu} 
      selectedPokemon={selectedPokemon} 
      setSelectedPokemon={setSelectedPokemon}/>
      {/**passing the selected pokemon to the Pokecard to get the data from APi for the pokemmon */}
      <PokeCard selectedPokemon={selectedPokemon}/>
    </>
  )
}

export default App
