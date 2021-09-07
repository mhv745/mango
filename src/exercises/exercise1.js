import React, {useState, useEffect} from "react"
import Range from "../components/range1";


export const Exercise1 = ({onChange}) => {
    const [values, setValues] = useState({min:0, max: 100})
    const [value, setValue] = useState()

    useEffect(() => {
        console.log("fetching")
        window.fetch("http://demo9008528.mockable.io/range1")
        .then(res => res.json())
        .then(setValues)
    }, [])

    const change = (value) => {
        console.log("Valor cambiado: ", value)
        setValue(value)
    }
    return <>
        <button onClick={() => onChange("")} >Go to Home</button>
        <button onClick={() => onChange("exercise2")} >Go to Exercise 2</button>

        <div>
            <Range {...values} onChange={change} />
            {value && <p>Min: ${value.min}, Max: ${value.max}</p>}
        </div>
    </>
}