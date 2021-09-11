import React, {useEffect, useState, useRef, forwardRef, useCallback, useImperativeHandle} from "react"
import PropTypes from 'prop-types';
import { getOfsetOfValue, getNextValue, getOffsetValues, getRealValue } from "../util/util"

/**
 * Custom hook para transformar entre unidades y porcentajes
 * @param width: Ancho del slider
 * @param min: valor mínimo
 * @param max: valor máximo
 */
const useConverter = (width, min, max) => {
    const percentToValue = (value = 0) => {
        if(typeof width !== undefined){
            const pixels = value * width / 100
            const resultado =  (pixels * (max - min) / width) + min
            return resultado
        }
    }

    const valueToPercent = (value) => {
        if(typeof width !== undefined){
            const real = (value - min) * width / (max - min)
            const resultado = real * 100 / width
            return resultado
        }
    }

    return { percentToValue, valueToPercent }
}


const Range = ({onChange, defaultValue, rangeValues, min = 0, max= 100, clickOnLabel, minDistance, ...rest}) => {
    const sliderRef = useRef()
    const valuesRef = useRef()
    const [sliderRect, setSliderRect] = useState()
    const [minimo, setMinimo] = useState(0)
    const [maximo, setMaximo] = useState(100)

    const [bullet1, setBullet1] = useState()
    const [bullet2, setBullet2] = useState()
    const bullet1Ref = useRef()
    const bullet2Ref = useRef()

    const { percentToValue, valueToPercent } = useConverter(sliderRect?.width || 200, minimo, maximo)

    useEffect(() => {
        const rect = sliderRef.current?.getBoundingClientRect()
        setSliderRect(rect)
        reset()
    }, [sliderRef?.current])

    useEffect(() => {
        if(bullet1Ref?.current && bullet2Ref.current){
            bullet1Ref.current.update(bullet1.value)
            bullet2Ref.current.update(bullet2.value)
        }
        if(typeof bullet1?.value === "undefined" || typeof bullet2?.value === "undefined"|| typeof onChange === "undefined") return 
        onChange({
            min: percentToValue(bullet1.value),
            max: percentToValue(bullet2.value)
        })
    }, [bullet1, bullet2])

    const reset = () => {
        const minimoAbsoluto = Array.isArray(rangeValues) && rangeValues.length > 0 ? 
        rangeValues[0] : min || 0;
        const maximoAbsoluto = Array.isArray(rangeValues) && rangeValues.length > 0 ? 
            rangeValues[rangeValues.length - 1] : max || 100;
        const valorBullet1 = typeof defaultValue?.min !== "undefined" && defaultValue.min >=  minimoAbsoluto ? 
            defaultValue.min : 
            minimoAbsoluto;
        const valorBullet2 = typeof defaultValue?.max !== "undefined" && defaultValue.max <=  maximoAbsoluto ? 
            defaultValue.max : 
            maximoAbsoluto;
        setMinimo(minimoAbsoluto)
        setMaximo(maximoAbsoluto)
        setBullet1({
            min: valueToPercent(minimoAbsoluto),
            max: valueToPercent(maximoAbsoluto),
            value: valueToPercent(valorBullet1)
        })
        setBullet2({
            min: valueToPercent(minimoAbsoluto),
            max: valueToPercent(maximoAbsoluto),
            value: valueToPercent(valorBullet2)
        })
        valuesRef.current = {min: valorBullet1, max: valorBullet2}
    }

    const normalizar = (value, arr) => {
        const real = percentToValue(value)
        if(Array.isArray(arr) && arr.length > 0){
            const proximo = arr
                .reduce((prev, curr) => Math.abs(curr - real) < Math.abs(prev - real) ? curr : prev)
            return valueToPercent(proximo)
        }
        const proximo = Math.round(real * 100) / 100
        return valueToPercent(proximo)
    }

    const getPosiblesValores = (desde, hasta) => {
        if(Array.isArray(rangeValues) && rangeValues.length > 0){
            if(typeof desde !== "undefined"){
                const index = rangeValues.indexOf(percentToValue(desde))
                return rangeValues.slice(index + 1)
            }
            if(typeof hasta !== "undefined"){
                const index = rangeValues.indexOf(percentToValue(hasta))
                return rangeValues.slice(0, index)
            }
        }
    }

    const change = (value, bullet) => {
        const realBullet1 = percentToValue(bullet1.value)
        const realBullet2 = percentToValue(bullet2.value)

        if(bullet === "bullet1"){
            let normalizado = normalizar(value, getPosiblesValores(undefined, bullet2.value))
            const realNormalizado = percentToValue(normalizado)
            if(minDistance > 0 && Math.abs(realNormalizado - realBullet2) < minDistance){
                normalizado =  valueToPercent(realBullet2 - minDistance)
            }
            setBullet1(prev => ({...prev, value: normalizado}))
            setBullet2(prev => ({...prev, min: normalizado}))
        }else if(bullet === "bullet2"){
            let normalizado = normalizar(value, getPosiblesValores(bullet1.value, undefined))
            const realNormalizado = percentToValue(normalizado)
            if(minDistance > 0 && Math.abs(realNormalizado - realBullet1) < minDistance){
                normalizado =  valueToPercent(realBullet1 + minDistance)
            }
            setBullet2(prev => ({...prev, value: normalizado}))
            setBullet1(prev => ({...prev, max: normalizado}))
        }
        
    }

    
    return (
        <div {...rest} className={`${rest.className|| ""} range`.replace(" ", "")} >
            <div className="range-wrapper">
            <Label 
                text={minimo} 
                onClick={!clickOnLabel ? undefined : () => change(valueToPercent(minimo), "bullet1")} 
            />
            <Slider ref={sliderRef}>
                {sliderRect &&
                    <>
                        <Bullet 
                            values={bullet1} 
                            sliderRect={sliderRect}
                            onChange={(value) => change(value, "bullet1")}
                            ref={bullet1Ref}
                        />
                        <Bullet 
                            values={bullet2} 
                            sliderRect={sliderRect}
                            onChange={(value) => change(value, "bullet2")}
                            ref={bullet2Ref}
                        />
                    </>
                }
                {
                    rangeValues && <Tracks values={rangeValues.map(v => valueToPercent(v))} />
                }
            </Slider>
            <Label 
                text={maximo} 
                onClick={!clickOnLabel ? undefined : () => change(valueToPercent(maximo), "bullet2")} 
            />
            </div>
        </div>
    )
}

const Tracks = ({values}) => {
    return <div style={{width: "100%"}}>
        {
            values.map((v, i) => <span key={i} style={{
                            position: "absolute",
                            top: "-2px",
                            width: "1px",
                            height: "5px",
                            background: "white",
                            left: `${v}%`
                        }} />)
        }
    </div>
}

const Bullet  = forwardRef(({values, sliderRect, onChange, className, ...rest}, ref) => {
    const [dragging, setDragging] = useState(false)
    
    const bulletRef = useRef()
    const offsetBulletRef = useRef()
    const lastPosX = useRef()
    const bulletWidthRef = useRef(10)

    const {min, max, value} = values

    useImperativeHandle(
        ref,
        () => ({
            update: (value) => move(value)
        }),
        [],
    )

    useEffect(() => {
        if(bulletRef?.current){
            bulletWidthRef.current = bulletRef.current.getBoundingClientRect().width
        }
    }, [bulletRef.current])

    useEffect(() => {
         move(value)
    }, [value])

    useEffect(() => {
        if(dragging){
            document.addEventListener("mousemove", mouseMove)
            document.addEventListener('mouseup', mouseUp);
            return  () => document.removeEventListener("mousemove", mouseMove);
        }
    }, [dragging])

    const mouseUp = () => {
        document.removeEventListener('mouseup', mouseUp);
        setDragging(false)
        if(onChange){
            onChange(lastPosX.current)
        }
    }

    const mouseDown = (event) => {
        setDragging(true)
        offsetBulletRef.current = event.clientX - bulletRef.current.getBoundingClientRect().left
    }

    const mouseMove = (event) => { 
        if(dragging){
            const newPosX = event.clientX - sliderRect.left
            let percent = newPosX * 100 / sliderRect.width
            if(percent < min){
                percent = min
            }else if(percent > max){
                percent = max
            }
            move(percent)
        }
        
    }

    const move = (value) => {
        const pos = `calc(${value}% - ${bulletWidthRef.current / 2}px)`
        bulletRef.current.style.left = pos
        lastPosX.current = value
    }


    return <span 
        {...rest}
        style={{cursor: dragging ? "ew-resize" : "col-resize"}}
        onMouseDown={mouseDown} 
        className={`bullet ${className || ""}`.replace(" ", "")} 
        ref={bulletRef} 
    />
})

const Slider = React.forwardRef(({children, className, ...rest}, ref) => {
    return <div className="slider-wrapper" >
        <div {...rest}  className={`slider ${className || ""}`.replace(" ", "")} ref={ref}>
            {children}
        </div>
    </div>
})

const Label = ({className, text, onClick, ...rest}) => {
    return <span {...rest} style={{cursor: onClick ? "pointer" : "default"}} onClick={onClick} className={`label ${className || ""}`.replace(" ", "")}>
        {text}
    </span>
}

Range.prototype = {
    onChange: PropTypes.func,
    defaultValue: PropTypes.shape({min:PropTypes.number, max:PropTypes.number}),
    rangeValues: PropTypes.arrayOf(PropTypes.number),
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    clickOnLabel: PropTypes.bool,
    minDistance: PropTypes.number
}

export default Range;
