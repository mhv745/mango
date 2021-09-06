import React, {useEffect, useState, useRef, useCallback} from "react"
import { getLeft, getPercent } from "../util/util"

export default Range = ({rangeValues, onChange}) => {
    const [values, setValues] = useState([])
    const sliderRef = useRef()

    const [dragging, setDragging] = useState()

    const bullet1Ref = useRef()
    const bullet2Ref = useRef()
    const bullet1Pos = useRef()
    const bullet2Pos = useRef()

    
    const [positionBullet1, setPositionBullet1] = useState(0)
    const [positionBullet2, setPositionBullet2] = useState(0)


    useEffect(() => {
        setValues(rangeValues.sort((a, b) => a-b))
    }, [rangeValues])

    useEffect(() => {
        if(!!dragging){
            console.log("Add mousemove")
            console.log("Add mouseup")
            document.addEventListener("mousemove", mouseMove)
            document.addEventListener('mouseup', mouseUp);
        return  () => {
            console.log("Remove mousemove")
            document.removeEventListener("mousemove", mouseMove);
        }
        }else{

        }
    }, [dragging])

    const mouseMove = (event) => {
        
        const left = sliderRef.current.getBoundingClientRect().left
        if(dragging === "bullet1"){
            let newPosX = event.clientX - bullet1Pos.current - left
            const end = sliderRef.current.offsetWidth - bullet1Ref.current.offsetWidth
            const start = 0
            if(newPosX < start){
                newPosX = 0
            }
            if(newPosX > end){
                newPosX = end
            }
            const percent = getPercent(newPosX, end)
            bullet1Ref.current.style.left = getLeft(percent)
            console.log("dragging", percent)
        }
        if(dragging === "bullet2"){
            let newPosX = event.clientX - bullet2Pos.current - left
        }
        
    }

    const mouseUp = () => {
        setDragging(undefined)
        console.log("Remove mouseup")
        document.removeEventListener('mouseup', mouseUp);
    }

    const mouseDown = (event, bullet) => {
        console.log("mousedown")
        setDragging(bullet)
        if(bullet === "bullet1"){
            bullet1Pos.current = event.clientX - bullet1Ref.current.getBoundingClientRect().left
        }
        if(bullet === "bullet2"){
            bullet2Pos.current = event.clientX - bullet2Ref.current.getBoundingClientRect().left
        }
    }


    return <div className="range">
        <div className="range-wrapper">
            <Label text={values.length > 0 ? values[0] : ""} />
            <Slider ref={sliderRef}>
                <Bullet ref={bullet1Ref} onMouseDown={(ev) => mouseDown(ev, "bullet1")} />
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

const Bullet = React.forwardRef(({position, className, ...rest}, ref) => {
    return <span {...rest} className={`bullet ${className || ""}`.replace(" ", "")} ref={ref} />
})

const Label = React.forwardRef(({className, text, ...rest}, ref) => {
    return <span {...rest} className={`label ${className || ""}`.replace(" ", "")}>
        {text}
    </span>
})