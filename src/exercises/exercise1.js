import React from "react"
import Range from "../components/range1";


export const Exercise1 = ({onChange}) => {
 
    return <>
        <button onClick={() => onChange("")} >Go to Home</button>
        <button onClick={() => onChange("exercise2")} >Go to Exercise 2</button>

        <div>
            <Range />
        </div>
    </>
}