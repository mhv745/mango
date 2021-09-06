import React, {useState} from "react"

export const Home = ({onChange}) => {
 
    return <>
        <button onClick={() => onChange("exercise1")} >Go to Exercise 1</button>
        <button onClick={() => onChange("exercise2")} >Go to Exercise 2</button>
    </>
}