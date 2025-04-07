import { useEffect, useRef, useState } from "react"

const info_margin = 10; // px

export const ItemInfo = () => {
  const divRef = useRef<HTMLDivElement>(null)
  const [ pos, setPos ] = useState({
    left: 0,
    top: 0,
  })

  useEffect(()=>{
    if(divRef !== null) {
      const W = document.body.offsetWidth
      const H = document.body.offsetHeight
      const P_W = divRef.current.parentElement.clientWidth;
      const p_x = divRef.current.parentElement.offsetLeft;
      const p_y = divRef.current.parentElement.offsetTop;
      const w = divRef.current.clientWidth
      const h = divRef.current.clientHeight
      
      let x = p_x + (P_W - w)/2
      let y = p_y - h - 8

      if(x < info_margin) x = info_margin
      else if(x+w > W-info_margin) x = W-info_margin-w
      if(y < info_margin) y = info_margin
      else if(y+h > H-info_margin) y = H-info_margin-h

      setPos({
        left: x - p_x, top: y - p_y
      })
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