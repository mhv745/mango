import React, {useState} from "react"
import { useHistory } from "react-router-dom"



export const Home = () => {
    const {push} = useHistory()
    const change = (path) => {
        push(path)
    }

    return <>
        <button onClick={() => change("/exercise1")} >Go to Exercise 1</button>
        <button onClick={() => change("/exercise2")} >Go to Exercise 2</button>
    </>
}