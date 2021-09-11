import React, {useState, useEffect} from "react"
import Range from "../components/range"
import { useHistory } from "react-router-dom"

export const Exercise1 = () => {
    const [values, setValues] = useState({min:0, max: 100})
    const [value, setValue] = useState()
    const {push} = useHistory()

    useEffect(() => {
        window.fetch("http://demo9008528.mockable.io/range1")
        .then(res => res.json())
        .then(setValues)
    }, [])

    const change = (value) => {
        setValue(value)
    }
    
    const goTo = (path) => {
        push(path)
    }

    return <>
        <button onClick={() => goTo("/")} >Go to Home</button>
        <button onClick={() => goTo("/exercise2")} >Go to Exercise 2</button>

        <div>
            <Range clickOnLabel min={values.min} max={values.max} minDistance={5}  onChange={change} />
            {value && <p>Min: ${value.min}, Max: ${value.max}</p>}
        </div>
    </>
}