import React, { useState } from 'react'
import { useHistory } from 'react-router'

import Range from "../components/range"


export const Examples = () => {
    const {push} = useHistory()

    const goTo = (path) => {
        push(path)
    }

    return <>
        <button onClick={() => goTo("/")} >Go to Home</button>
        <div>
            <ExampleItem titule="Without parameters" />
            <ExampleItem min={10} max={20} titule="Max and min" />
            <ExampleItem defaultValue={{min: 10, max: 90}} titule="Default Values" />
            <ExampleItem clickOnLabel titule="Click on label" />
            <ExampleItem minDistance={20} titule="Min distance 20" />
            <ExampleItem rangeValues={[5, 10, 15, 20, 25]} titule="Range values" />
        </div>
        
    </>
}

const ExampleItem = ({titule, ...rest}) => {
    const [values, setValues] = useState()

    return <div>
        <hr />
        <h3>{titule}</h3>
        <Range {...rest} onChange={setValues} />
        {values && <p>Min: ${values.min}, Max: ${values.max}</p>}
    </div>
}