import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle} from "react"
import {  getOfsetOfValue, getNextValue, getOffsetValues, getRealValue } from "../util/util"

export default Range = ({rangeValues, onChange}) => {
    const [values, setValues] = useState([])
    const sliderRef = useRef()
    const [sliderRect, setSliderRect] = useState()

    const [bullet1, setBullet1] = useState(0)
    const [bullet2, setBullet2] = useState(100)
    const bullet1Ref = useRef()
    const bullet2Ref = useRef()
    
    const [dimensions1, setDimensions1] = useState({min: 0, max: 0}) //De 0 a bullet 2
    const [dimensions2, setDimensions2] = useState({min: 0, max: 0}) //De bullet1 a 100

    useEffect(() => {
        const orderedValues = [...rangeValues.sort((a,b) => a-b)]
        setValues(orderedValues)
        setBullet1(0)
        setBullet2(100)
    }, [rangeValues])

    useEffect(() => {
        if(sliderRef.current){
            setSliderRect(sliderRef.current.getBoundingClientRect())
        }
    }, [sliderRef.current])

    useEffect(() => {
        if(sliderRect){
            const offsetValues = getOffsetValues(values, sliderRect.width)
            const maxBullet1 = bullet2 - (offsetValues * 100 / sliderRect.width)
            const minBullet2 = bullet1 + (offsetValues * 100 / sliderRect.width)
            setDimensions1({min: 0, max: maxBullet1})
            setDimensions2({min: minBullet2, max: 100})
        }
    }, [sliderRect, bullet1, bullet2, values])

    useEffect(() => {
        if(onChange && sliderRect?.width){
            const realMinValue = getRealValue(bullet1, values, sliderRect.width)
            const realMaxValue = getRealValue(bullet2, values, sliderRect.width)
            onChange({min: realMinValue, max:realMaxValue})
        }
    }, [bullet1, bullet2])

    const handleChange = (value, bullet) => {
        const offset = value * sliderRect.width / 100 //En px
        const nextPos = getNextValue(offset, values, sliderRect.width)
        const near = getOfsetOfValue(nextPos,values, sliderRect.width) * 100 / sliderRect.width
        if(bullet === "bullet1"){
            setBullet1(near)
            bullet1Ref.current.update(near)
        }else{
            setBullet2(near)
            bullet2Ref.current.update(near)
        }
    }

    return <div className="range">
        <div className="range-wrapper">
            <Label text={values.length > 0 ? values[0] : ""} />
            <Slider ref={sliderRef}>
                {sliderRect && 
                <>
                <Bullet 
                    dimensions={dimensions1}
                    slideRect={sliderRect}
                    value={bullet1}
                    ref={bullet1Ref}
                    onChange={(value) => handleChange(value, "bullet1")} 
                />
                <Bullet 
                    dimensions={dimensions2}
                    slideRect={sliderRect}
                    value={bullet2}
                    ref={bullet2Ref}
                    onChange={(value) => handleChange(value, "bullet2")} 
                />
                </>}
                {/* <Bullet ref={bullet2Ref} onMouseDown={(ev) => mouseDown(ev, "bullet2")} /> */}
                {
                    values.map(v => <Track key={v} />)
                }
            </Slider>
            <Label text={values.length > 0 ? values[values.length - 1] : ""} />
        </div>
    </div>
}


const Slider = React.forwardRef(({children, className, ...rest}, ref) => {
    return <div className="slider-wrapper" >
        <div {...rest}  className={`slider ${className || ""}`.replace(" ", "")} ref={ref}>
            {children}
        </div>
    </div>
})

const Track = React.forwardRef(({className, ...rest}, ref) => {
    return <span {...rest} className={`track ${className || ""}`.replace(" ", "")} />
})

const Bullet  = forwardRef(({dimensions, slideRect, value, onChange, className, ...rest}, ref) => {
    const [dragging, setDragging] = useState(false)
    
    const bulletRef = useRef()
    const offsetBulletRef = useRef()
    const lastPosX = useRef()

    const {min, max} = dimensions

    useImperativeHandle(
        ref,
        () => ({
            update: (value) => move(value)
        }),
        [],
    )

    useEffect(() => {
         move(value)
    }, [value])

    useEffect(() => {
        if(dragging){
            document.addEventListener("mousemove", mouseMove)
            document.addEventListener('mouseup', mouseUp);
            return  () => {
                document.removeEventListener("mousemove", mouseMove);
            }
        }
    }, [dragging])

    const mouseMove = (event) => { 
        if(dragging){
            const newPosX = event.clientX - slideRect.left
            let percent = newPosX * 100 / slideRect.width
            if(percent < min){
                percent = min
            }else if(percent > max){
                percent = max
            }
            move(percent)
        }
        
    }

    const move = (value) => {
        const pos = `calc(${value}% - ${bulletRef.current.getBoundingClientRect().width / 2}px)`
        bulletRef.current.style.left = pos
        lastPosX.current = value
    }

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


    return <span 
        {...rest}
        style={{cursor: dragging ? "ew-resize" : "col-resize"}}
        onMouseDown={mouseDown} 
        className={`bullet ${className || ""}`.replace(" ", "")} 
        ref={bulletRef} 
    />
})


const Label = React.forwardRef(({className, text, ...rest}, ref) => {
    return <span {...rest} className={`label ${className || ""}`.replace(" ", "")}>
        {text}
    </span>
})