import React, {useEffect, useState, useRef, useCallback} from "react"
import { getLeft, getPercent } from "../util/util"

export default Range = ({rangeValues, onChange}) => {
    const [values, setValues] = useState([])
    const sliderRef = useRef()
    const [sliderRect, setSliderRect] = useState()
    const [sliderWidth, setSliderWidth] = useState(200)
    const [bullet1, setBullet1] = useState({min: 0, max: 0})
    const [bullet2, setBullet2] = useState({min: 0, max: 0})

    const [bullet1Pos, setBullet1Pos] = useState(0)
    const [bullet2Pos, setBullet2Pos] = useState(100)
 
    useEffect(() => {
        setValues(rangeValues.sort((a, b) => a-b))
    }, [rangeValues])

    useEffect(() => {
        if(sliderRef.current){
            const rect = sliderRef.current.getBoundingClientRect()
            setSliderRect(rect)
            setSliderWidth(sliderRef.current.offsetWidth)
        }
    }, [sliderRef.current])

    useEffect(() => {
        if(sliderRect){
            setBullet1({min: sliderRect.left, max: sliderRect.left + bullet2Pos, width:sliderWidth})
            setBullet2({min: sliderRect.left + bullet1Pos, max: sliderRect.right, width:sliderWidth})
        }
    }, [sliderRect])

    return <div className="range">
        <div className="range-wrapper">
            <Label text={values.length > 0 ? values[0] : ""} />
            <Slider ref={sliderRef}>
                {sliderRect && <Bullet dimensions={bullet1} onChange={setBullet1Pos} />}
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

const Bullet = React.forwardRef(({dimensions,values, onChange, className, ...rest}, ref) => {
    const [dragging, setDragging] = useState(false)
    const bulletRef = useRef()
    const bulletPos = useRef()

    const {min, max, width} = dimensions

    console.log(min, max, width)

    useEffect(() => {
        if(dragging){
            console.log("Add mousemove")
            console.log("Add mouseup")
            document.addEventListener("mousemove", mouseMove)
            document.addEventListener('mouseup', mouseUp);
            return  () => {
                console.log("Remove mousemove")
                document.removeEventListener("mousemove", mouseMove);
            }
        }
    }, [dragging])

    const mouseMove = (event) => { 
        if(dragging){
            let newPosX = event.clientX - bulletPos.current - min
            const end = (max - min) - bulletRef.current.offsetWidth
            const start = 0
            if(newPosX < start){
                newPosX = start
            }
            if(newPosX > end){
                newPosX = end
            }
            const maxPercent = end * 100 / width
            const percent = newPosX * maxPercent / end // getPercent(newPosX, end)
            const newValue = getLeft(percent)
            bulletRef.current.style.left = newValue
            if(onChange){
                onChange(newPosX)
            }
        }
        
    }

    const mouseUp = () => {
        setDragging(false)
        console.log("Remove mouseup")
        document.removeEventListener('mouseup', mouseUp);
    }

    const mouseDown = (event) => {
        setDragging(true)
        bulletPos.current = event.clientX - bulletRef.current.getBoundingClientRect().left
    }


    return <span {...rest}  onMouseDown={mouseDown} className={`bullet ${className || ""}`.replace(" ", "")} ref={bulletRef} />
})

const Label = React.forwardRef(({className, text, ...rest}, ref) => {
    return <span {...rest} className={`label ${className || ""}`.replace(" ", "")}>
        {text}
    </span>
})