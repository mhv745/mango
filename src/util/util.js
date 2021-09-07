
export const percentToPx = (percent, width) => {
    return 

}

export const getRealValue = (position, values, width) => {
    
    const offsets = getOffsetValues(values, width)
    
    const offset = width * position / 100
    const index = offset / offsets
    
    return values[index]
}

/**
 * Devuelve separación entre puntos
 */
export const getOffsetValues = (values ,width) => {
    return width / (values.length - 1)
}

/**
 * Devuelve los px desde el inicio del slider hasta value
 */
export const getOfsetOfValue = (value, values ,width) => {
    const index = values.findIndex(v => v === value)
    const offsetValues = getOffsetValues(values, width)
    return (index * offsetValues)
}

/**
 * Devuelve el valor más cercano de la posición dada
 */
export const getNextValue = (position ,values,  width) => {    
    let pos = 0
    let menorDistancia = width;
    values.forEach(v => {
        const offsetV = getOfsetOfValue(v, values, width)
        const distancia = Math.abs(position - offsetV)
        if(distancia < menorDistancia){
            menorDistancia = distancia
            pos = v
        }
    });
    return pos
}