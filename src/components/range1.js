import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle} from "react"
import { getOfsetOfValue, getNextValue, getOffsetValues, getRealValue } from "../util/util"

export default Range = ({min, max,onChange}) => {
    const sliderRef = useRef()
    const [sliderRect, setSliderRect] = useState()

    const [bullet1, setBullet1] = useState(0)
    const [bullet2, setBullet2] = useState(100)
    const bullet1Ref = useRef()
    const bullet2Ref = useRef()
    
    const [dimensions1, setDimensions1] = useState({min: min, max: max}) //De 0 a bullet 2
    const [dimensions2, setDimensions2] = useState({min: min, max: max}) //De bullet1 a 100

    useEffect(() => {
        if(sliderRef.current){
            setSliderRect(sliderRef.current.getBoundingClientRect())
        }
    }, [sliderRef.current])

    useEffect(() => {
        setBullet1(0)
        setBullet2(100)
    }, [min, max])

    useEffect(() => {
        if(sliderRect){
            console.log(bullet1, bullet2, sliderRect)
            setDimensions1({min: 0, max: Math.floor(bullet2)})
            setDimensions2({min: Math.ceil(bullet1), max: 100})
            // const offsetValues = getOffsetValues([], sliderRect.width)
            // const maxBullet1 = bullet2 - (offsetValues * 100 / sliderRect.width)
            // const minBullet2 = bullet1 + (offsetValues * 100 / sliderRect.width)
            // setDimensions1({min: min, max: maxBullet1})
            // setDimensions2({min: minBullet2, max: max})
        }
    }, [sliderRect, bullet1, bullet2])

    useEffect(() => {
        if(onChange && sliderRect?.width){
            const realMinValue = Math.round((max - min) * bullet1 / 100) + min
            const realMaxValue = Math.round((max - min) * bullet2 / 100) + min
            onChange({min: realMinValue, max:realMaxValue})
        }
    }, [bullet1, bullet2])

    const handleChange = (value, bullet) => {
        console.log(value, bullet) //Ex: value = 50 -> ha soltado a la mitad
        
        if(bullet === "bullet1"){
            setBullet1(value)
        }else if(bullet === "bullet2"){
            setBullet2(value)
        }
        // const offset = value * sliderRect.width / 100 //En px
        // const nextPos = getNextValue(offset, [], sliderRect.width)
        // const near = getOfsetOfValue(nextPos,[], sliderRect.width) * 100 / sliderRect.width
        // if(bullet === "bullet1"){
        //     setBullet1(near)
        //     bullet1Ref.current.update(near)
        // }else{
        //     setBullet2(near)
        //     bullet2Ref.current.update(near)
        // }
    }

    return <div className="range">
        <div className="range-wrapper">
            <Label text={min.toString() || ""} onClick={() => handleChange(0, "bullet1")} />
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
                    </>
                }
            </Slider>
            <Label text={max.toString() || ""} onClick={() => handleChange(100, "bullet2")} />
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


const Label = ({className, text, onClick, ...rest}) => {
    return <span {...rest} style={{cursor: "pointer"}} onClick={onClick} className={`label ${className || ""}`.replace(" ", "")}>
        {text}
    </span>
}