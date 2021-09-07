import React, {useState, useEffect} from "react"
import Range from "../components/range2";
import { useHistory } from "react-router-dom"

export const Exercise2 = ({onChange}) => {
    const [values, setValues] = useState([])
    const [value, setValue] = useState()
    const {push} = useHistory()

    useEffect(() => {
        window.fetch("https://demo9008528.mockable.io/range2")
        .then(res => res.json())
        .then(v => setValues(v))
    }, [])

    useEffect(() => {
        if(values.length > 0){
            setValue({min: values[0], max: values[values.length - 1]})
        }
    }, [values])

    const change = (value) => {
        console.log("Valor cambiado: ", value)
        setValue(value)
    }

    const goTo = (path) => {
        push(path)
    }

    return <>
        <button onClick={() => goTo("/")} >Go to Home</button>
        <button onClick={() => goTo("/exercise1")} >Go to Exercise 1</button>


        <div>
            <Range rangeValues={values} onChange={change} />
            {value && <p>Min: ${value.min}, Max: ${value.max}</p>}
        </div>
    </>
}