import { useState } from "react"
import { first151Pokemon, getFullPokedexNumber } from "../utils"

export default function SideNav(props){
    const {selectedPokemon, setSelectedPokemon, handleCloseMenu, showSideMenu} = props
    
    const [searchValue, setSearchValue] = useState("")
    //This is used to filter the pokemon which will be searched via input, if nothing is searched it will return the whole list other the searched pokemon will be returned
    const filteredPokemon = first151Pokemon.filter((ele, eleIndex)=>{
        //if fullpokedexNumber includes the current search value, return true
            if (getFullPokedexNumber(eleIndex).includes(searchValue)){
                return true
            }
        //if the pokemon name includes the current search value, return true
            if (ele.toLowerCase().includes(searchValue.toLowerCase())){
                return true
            }
        
        //otherwise exclude value from the array
            return false//(<p>No Pokemon Found!</p>)
    })

    return (<nav className={"scrollable-container " + (showSideMenu ? " open" : "")} >
        <div className={"header " + (showSideMenu ? " open" : "")}>
            {console.log("SHOW SIDE MENU BEOFRE "+ showSideMenu)}
            <button onClick={handleCloseMenu} className="open-nav-button">
            {console.log("SHOW SIDE MENU AFTER "+ showSideMenu)}
                <i className="fa-solid fa-arrow-left-long"></i>
            </button>   
            <h1 className={"text-gradient"}>Pokédex</h1>
        </div>
        <input placeholder="E.g 001 or Pika..." value={searchValue} onChange={(e)=>{
            setSearchValue(e.target.value)
            
        }} />
        {
            //This hard coded object/array is imported from index.js in util
            //Mapped the each pokemon name to return as a button along with name and index
            // THis was changed when search was implemented as we needed filtered search -- first151Pokemon.map((pokemon, pokemonIndex) => { 
                filteredPokemon.map((pokemon, pokemonIndex) => {
                    const truePokedexNumber = first151Pokemon.indexOf(pokemon)
                return (<button className={"nav-card " + (pokemonIndex === selectedPokemon ? "nav-card-selected" : " ")} key={pokemonIndex} 
                onClick={()=>{setSelectedPokemon(truePokedexNumber)
                     handleCloseMenu()}}
                >
                    <p>{getFullPokedexNumber(truePokedexNumber)}</p>
                    <p>{pokemon}</p>
                             {console.log("selected pokemon" + selectedPokemon)}
                </button>
                )
            
            })
        }
    </nav>
    )
}