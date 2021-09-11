import React, {useState} from "react"
import { useHistory } from "react-router-dom"
import Range from "../components/range";

export const Home = () => {
    const {push} = useHistory()
    const change = (path) => {
        push(path)
    }

    const cambio = (values) => {
        console.log("Recibido el cambio: ", values)
    }
    return <>
        <button onClick={() => change("/exercise1")} >Go to Exercise 1</button>
        <button onClick={() => change("/exercise2")} >Go to Exercise 2</button>
        <div> 
            <Range clickOnLabel rangeValues={[1.99, 5.99, 10.99, 30.99, 50.99, 70.99]} onChange={cambio} />
        </div>
    </>
}