import React, {useState, useEffect} from "react"
import Range from "../components/range"
import { useHistory } from "react-router-dom"

export const Exercise2 = () => {
    const [range, setRange] = useState([])
    const [values, setValues] = useState()
    const {push} = useHistory()

    useEffect(() => {
        window.fetch("https://demo9008528.mockable.io/range2")
        .then(res => res.json())
        .then(v => setRange(v))
    }, [])

    const change = (values) => {
        setValues(values)
    }

    const goTo = (path) => {
        push(path)
    }

    return <>
        <button onClick={() => goTo("/")} >Go to Home</button>
        <button onClick={() => goTo("/exercise1")} >Go to Exercise 1</button>


        <div>
            <Range rangeValues={range} onChange={change} />
            {values && <p>Min: ${values.min}, Max: ${values.max}</p>}
        </div>
    </>
}