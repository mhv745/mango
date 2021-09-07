import React, {useState, useEffect} from "react"
import Range from "../components/range1";


export const Exercise1 = ({onChange}) => {
    const [values, setValues] = useState([])

    useEffect(() => {
        window.fetch("https://demo9008528.mockable.io/range2").then(res => res.json()).then(v => setValues(v))
    }, [])

    const change = (value) => {
    }
    return <>
        <button onClick={() => onChange("")} >Go to Home</button>
        <button onClick={() => onChange("exercise2")} >Go to Exercise 2</button>

        <div>
            <Range rangeValues={values} onChange={change} />
        </div>
    </>
}