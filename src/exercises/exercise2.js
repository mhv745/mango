import React, {useState, useEffect} from "react"
import Range from "../components/range2";

export const Exercise2 = ({onChange}) => {
    const [values, setValues] = useState([])

    useEffect(() => {
        window.fetch("https://demo9008528.mockable.io/range2").then(res => res.json()).then(v => setValues(v))
    }, [])

    const change = (value) => {
        console.log("Valor cambiado: ", value)
    }

    return <>
        <button onClick={() => onChange("")} >Go to Home</button>
        <button onClick={() => onChange("exercise1")} >Go to Exercise 1</button>


        <div>
            <Range rangeValues={values} onChange={change} />
        </div>
    </>
}