import React, {useState} from "react"
import { Exercise1 } from "../exercises/exercise1"
import { Exercise2 } from "../exercises/exercise2"
import {Home} from  "./home"


export const App = () => {
    const [ejercicio, setEjercicio] = useState("")

    const goTo = (url) => {
        setEjercicio(url)
    }

    return <div className="mango">
        <h1>Mango</h1>
        {
            ejercicio === "exercise1" ? <Exercise1  onChange={goTo} /> : 
            ejercicio === "exercise2" ? <Exercise2  onChange={goTo} /> : 
             <Exercise2  onChange={goTo} />
        }
        
    
    </div>
}