import { getOffsetValues, getNextValue,getOfsetOfValue, getRealValue } from "./util";

const values = [5,10,15,20, 25]
const width = 200

describe("Util", () => {
    describe("getOffsetValues", () => {
        test('should obtener desplazamiento de valores', () => {
            const result = getOffsetValues(values, width)
            expect(result).toBe(50)
        })

        test('should devolver 0 si valores.length < 2 ', () => {
            const result = getOffsetValues([5], width)
            expect(result).toBe(0)
        })
    })

    describe("getNextValue", () => {
        test('should Obtener valor más cercano', () => {
            const result = getNextValue(49,values, width)
            expect(result).toBe(10)
        })
        test('should Obtener el mismo valor si position == offset del valor', () => {
            const result = getNextValue(0,values, width)
            expect(result).toBe(5)
        })
        
    })

    describe("getOfsetOfValue", () => {
        test('should obtener el offset de un valor en px', () => {
            const result = getOfsetOfValue(10,values, width)
            expect(result).toBe(50)
        })
        test('should obtener excepción si el valor no se encuentra', () => {
            expect(() => getOfsetOfValue(30,values, width)).toThrow(Error)
        })
    })


    describe("getRealValue", () => {
        test('should obtener el valor real', () => {
            const result = getRealValue(0,values, width)
            expect(result).toBe(5)
        })

        test('should obtener undefined si no existe', () => {
            const result = getRealValue(1,values, width)
            expect(result).toBeUndefined()
        })
    })
})