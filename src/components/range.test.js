/**
 * @jest-environment jsdom
 */

import React from "react"
import "@testing-library/jest-dom/extend-expect"
import {render, fireEvent} from "@testing-library/react"
import Range from "./range"

describe("Range", () => {
    test("render component without parameters", () => {
        const component = render(<Range />)
        component.getByText("0")
        component.getByText("100")
    })

    test("render component with min parameter", () => {
        const component = render(<Range min={5} />)
        component.getByText("5")
    })

    test("render component with max parameter", () => {
        const component = render(<Range max={5} />)
        component.getByText("5")
    })

    test("render component with min and max parameters", () => {
        const component = render(<Range min={1} max={5} />)
        component.getByText("1")
        component.getByText("5")
    })

    test("render component with rangeValue parameter", () => {
        const component = render(<Range rangeValues={[1, 2, 3]} />)
        component.getByText("1")
        component.getByText("3")
    })
})

describe("Range events", () =>  {
    test("render bullet 1 and 2", () => {
        const component = render(<Range rangeValues={[1, 2, 3]} />)
        component.getByTestId("bullet1")
        component.getByTestId("bullet2")        
    })
})


