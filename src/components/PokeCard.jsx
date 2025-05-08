import { useEffect, useState } from "react"
import { getFullPokedexNumber, getPokedexNumber } from "../utils"
import TypeCard from "./TypeCard"
import Modal from "./Modal"

export default function PokeCard(props){
    const {selectedPokemon} = props 
    const [data, setData] = useState(null) // This useState will be used to fetch the Data and set the Data
    const [loading, setLoading] = useState(false) // This is used to define the loading status as if once the data is loaded we dont want to load it again
    const [skill, setSkill] = useState(null) //this is used for modal when particular skill is selected to launch modal
    const [loadingSkill, setLoadingSkill] = useState(false)

    const{name, height, abilities, stats, types, moves, sprites} = data || {} //this is the destruction from the data we fetched from the API

    const imgList = Object.keys(sprites || {}).filter(val => { //we are filtering out few details for the Sprites Object below
        if(!sprites[val]) {return false} //If there is no sprite with the values return false
        if(["versions", "other"].includes(val)) {return false} //There are two objects which are not needed named "versions" and "other" which are being filtered out
        return true
        
    })
    console.log("imgList" + imgList)
    
    console.log(sprites)

    async function fetchMoveData(move, moveUrl) {
        //This funtion is again an API call for the moves that are description loaded in Modal
        if(loadingSkill || !localStorage || !moveUrl ) {return}

        // check if Move is in the cache
        let moveCache = {}
        if(localStorage.getItem("pokemon-moves")){
            moveCache = JSON.parse(localStorage.getItem("pokemon-moves"))
        }

        if(move in moveCache){
            setSkill(moveCache[move])
            console.log("Found Move in Cache", moveCache[move])
        }

        // getting move from the API as it doesnt exist in the cache
        try{
            setLoadingSkill(true)
            const res = await fetch(moveUrl)
            const moveData = await res.json()
            console.log("Fetched Move from API", moveData)
            const description = moveData?.flavor_text_entries.filter(val => { // here the values are filtered to only firered-leafgreen and rest is eliminated
                return val.version_group.name = "firered-leafgreen"
            })[0]?.flavor_text
            console.log(move)
              console.log(description)  
            const skillData = {
                name: move, description
            }
            console.log("skillData: ", skillData)
            setSkill(skillData)
            moveCache[move] = skillData
            localStorage.setItem("pokemon-moves", JSON.stringify(moveCache))
        }
        catch(err){
            console.log(err)
        }
        finally{
            setLoadingSkill(false)
        }


    }

    useEffect(()=>{
        // If loading, exit logic
        if(loading || !localStorage){ return}

        //check if the selected pokemon information is available in the cache
        //1. Define the cache
        let cache = {} //Object as the JSON data is an Object
        if(localStorage.getItem("pokedex")){
            cache = JSON.parse(localStorage.getItem("pokedex")) //Overriding the above cache object variable to the availble info in localStorage
        }

        //2. Check if the available pokemon is available in the cache otherwise fetch from the API

        if(selectedPokemon in cache){
            //read from cache
            setData(cache[selectedPokemon])
            console.log("Found Pokemon in Cache")
            return
        }

      
        //we cache all the stuff with no avail and now we need to get the data from API
        async function fetchPokemonData() {
            setLoading(true)
            try{
                const baseUrl = "https://pokeapi.co/api/v2/"
                const suffix = "pokemon/" + getPokedexNumber(selectedPokemon) //getPokedexNumber as the API doesnt have pokemon at 0th number so selected pokemon at 0th index +1
                const finalUrl = baseUrl + suffix
                const res = await fetch(finalUrl)
                const pokemonData = await res.json()
                setData(pokemonData)
                console.log(pokemonData)
                console.log("Fetched Pokemon from API")
                cache[selectedPokemon] = pokemonData
                localStorage.setItem("pokedex", JSON.stringify(cache))
            }
            catch(err){
                console.log(err.message)
            }
            finally{
                setLoading(false)
            }
        }
        fetchPokemonData()
        // If we fetch the info from the API make sure to save it in the cache for the next time
    }, [selectedPokemon])

    //Displays Loading if data is not fetched or loading is true
    if(loading || !data){
        return(
            <div>
                <h4>Loading...</h4>
            </div>
        )
    }

    return(
        <div className="poke-card">
            {skill && (<Modal handleCloseModal={()=>{setSkill(null)}}> {/**The curly braces is for conditional rendering for when the skill is  true*/}
                {/** WHat goes below here is the children that is destructered in the Modal.jsx */}
                <div>
                    <h6 >Name</h6>
            <h2 className="skill-name">{skill.name.replaceAll("-", " ")}</h2>
                </div>
                <div>
                    <h6>Description</h6>
                    <p>{skill.description}</p>
                </div>
            </Modal>)}
            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{name}</h2>
            </div>
            <div className="type-container">
            {types.map((typeObj, typeIndex)=>{
                return <TypeCard key={typeIndex} type={typeObj?.type?.name}/>
            })}
            </div>
            <img src={"/pokemon/"+ getFullPokedexNumber(selectedPokemon) +".png"}alt={`${name}-large-img`}/>
            <div className="img-container">
                {imgList.map((spriteUrl, spriteIndex) => {
                    const imgUrl = sprites[spriteUrl]
                    console.log("spriteUrl")
                    console.log(spriteUrl)
                    console.log("imgUrl")
                    console.log(imgUrl)
                    return (
                        <img key={spriteIndex} src={imgUrl} alt={`${name}-img-${spriteUrl}`} />
                    )
                })}
            </div>
            <h3>Stats</h3>
            <div className="stats-card">
                {stats.map((statObj, statIndex) => {
                    const {stat, base_stat} = statObj //destructuring the stat Object further for base_Stat and stat.name
                    console.log(stat.name + base_stat)
                    return (
                        <div key={statIndex} className="stat-item"> 
                            <p>{stat?.name.replaceAll("-", " ")}</p> {/*/Stat Name display*/}
                            <h4>{base_stat}</h4> {/*/Stat Value display*/}
                        </div>
                    )
                })}
            </div>
            <div className="pokemon-move-grid">
                {
                    moves.map((moveObj, moveIndex)=> {
                        return(
                            <button className="button-card pokemon-move" key={moveIndex} onClick={()=> {fetchMoveData(moveObj?.move?.name, moveObj.move.url) }}>
                                <p>{moveObj?.move?.name.replaceAll("-", " ")}</p>
                              
                            </button>
                        )
                    })
                }
            </div>
        </div>
    )
}