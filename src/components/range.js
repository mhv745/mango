import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle} from "react"
import PropTypes from 'prop-types';
import { getOfsetOfValue, getNextValue, getOffsetValues, getRealValue } from "../util/util"


const Range = ({onChange, defaultValue, rangeValues, min, max, ...rest}) => {







    
    return (
        <div {...rest} className={`${rest.className|| ""} range`.replace(" ", "")} >
            <div className="range-wrapper">
            <Label text={min?.toString() || ""} onClick={() => handleChange(0, "bullet1")} />
            <Slider>
                <Bullet dimensions={{min, max}} />
                <Bullet dimensions={{min, max}} />
            </Slider>
            <Label text={min?.toString() || ""} onClick={() => handleChange(0, "bullet1")} />
            </div>
        </div>
    )
}

const Slider = React.forwardRef(({children, className, ...rest}, ref) => {
    return <div className="slider-wrapper" >
        <div {...rest}  className={`slider ${className || ""}`.replace(" ", "")} ref={ref}>
            {children}
        </div>
    </div>
})

const Bullet  = forwardRef(({dimensions, slideRect, value, onChange, className, ...rest}, ref) => {
    console.log(dimensions)
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

Range.prototype = {
    onChange: PropTypes.func,
    defaultValue: PropTypes.shape({min:PropTypes.number, max:PropTypes.number}),
    rangeValues: PropTypes.arrayOf(PropTypes.number) ,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
}

export default Range;
