import React, {useEffect, useState, useRef, useCallback} from "react"

export default Range = ({rangeValues, onChange}) => {
    const lineRef = useRef()
    const [values, setValues] = useState([])
    const [x, setX] = useState(0)
    const [dragging, setDragging] = useState(false)

    const [positionBullet1, setPositionBullet1] = useState(0)
    const [positionBullet2, setPositionBullet2] = useState(0)

    console.log(dragging)
    const move = useCallback(
        (e) => {
            if(dragging){
                setX(e.clientX)
                console.log(x)
            }
        },
        [dragging],
    )

    useEffect(() => {
        
        window.addEventListener("mousemove", move)
        const {width} = lineRef.current.getBoundingClientRect()
        setPositionBullet2(width)
        return () => window.removeEventListener("mousemove", move)
    }, [move])

    useEffect(() => {
        setValues(rangeValues.sort((a, b) => a-b))
    }, [rangeValues])

    const drag = (e) => {
        e.preventDefault();
        setDragging(true)
    }

    const drop = (e) => {
        e.preventDefault();
        setDragging(false)
    }

    return <div className="range">
        <div className="range-wrapper">
            <span className="label">{values.length > 0 ? values[0] : ""}</span>
            <Line ref={lineRef} className="line">
                <span draggable onDrag={drag} onDragLeave={drop} className="bullet" style={{transform: `translateX(${positionBullet1}px)`}}></span>
                <span  className="bullet" style={{transform: `translateX(${positionBullet2}px)`}}></span>
                {
                    values.map(v => <span key={v} className="line-break"></span>)
                }
            </Line>
            <span className="label">{values.length > 0 ? values[values.length - 1] : ""}</span>
        </div>
    </div>
}


const Line = React.forwardRef(({children, ...rest}, ref) => {
    return <div className="line-wrapper" >
        <div {...rest} ref={ref} className="line">
            {children}
        </div>
    </div>
})