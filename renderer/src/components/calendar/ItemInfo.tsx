import { useCallback, useEffect, useRef, useState } from "react"

const info_margin = 10; // px

export const ItemInfo = () => {
  const divRef = useRef<HTMLDivElement>(null)
  const [ pos, setPos ] = useState({
    left: 0,
    top: 0,
  })

  const pos_init = useCallback(() => {
    const W = window.innerWidth
    // const H = window.innerHeight
    const P_W = divRef.current.parentElement.clientWidth;
    const P_H = divRef.current.parentElement.clientHeight;
    const p_x = divRef.current.parentElement.offsetLeft;
    const p_y = divRef.current.parentElement.offsetTop;
    const w = divRef.current.clientWidth
    const h = divRef.current.clientHeight
    
    let x = p_x + (P_W - w)/2
    let y = p_y - h - 8

    if(x < info_margin) x = info_margin
    else if(x+w > W-info_margin) x = W-info_margin-w
    if(y < info_margin) {
      if(y < 0) {
        y = p_y + P_H + 8
      }
      else y = info_margin
    }
    // else if(y+h > H-info_margin) y = H-info_margin-h

    if(pos.left !== x - p_x && pos.top !== y - p_y) {
      setPos({
        left: x - p_x, top: y - p_y
      })
    }
    console.log('hi')
  }, [divRef])

  useEffect(()=>{
    if(divRef.current) {
      pos_init()
      window.addEventListener("resize", pos_init)
      return () => {
        window.removeEventListener("resize", pos_init)
      }
    }
  }, [])

  return (
    <div
      ref={divRef}
      className="item-info"
      style={{
        left: `${pos.left}px`,
        top: `${pos.top}px`,
      }}
    >
      <div className="item-info-box div-border shadow-lg">
        <div>val 1: 123456789</div>
        <div className="val-plus">val 2: 10</div>
        <div className="val-minus">val 3: 20</div>
        <div className="val-update">val 4: 30</div>
        <div>dummy data</div>
        <div>dummy data</div>
        <div>dummy data</div>
        <div>dummy data</div>
        <hr />
        <div className="font-normal">메모: 메모 내용</div>
      </div>
    </div>
  )
}