import { useCallback, useEffect, useRef, useState } from "react"
import { CalendarItemInfo } from "./calendar";

const info_margin = 10; // px
const state = ['', 'val-update', 'val-plus', 'val-minus']
const state_msg = ['', '(update)', '(+)', '(-)']

export const ItemInfo = ({
  info
}:{
  info: CalendarItemInfo
}) => {
  const divRef = useRef<HTMLDivElement>(null)
  const [ pos, setPos ] = useState({
    left: 0,
    top: 0,
    origin: 'bottom'
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
    let origin = 'bottom'

    if(x < info_margin) x = info_margin
    else if(x+w > W-info_margin) x = W-info_margin-w
    if(y < info_margin) {
      if(y < 0) {
        y = p_y + P_H + 8
        origin = 'top'
      }
      else y = info_margin
    }
    // else if(y+h > H-info_margin) y = H-info_margin-h

    if(pos.left !== x - p_x && pos.top !== y - p_y) {
      setPos({
        left: x - p_x, top: y - p_y, origin: origin
      })
    }
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
        transformOrigin: pos.origin,
      }}
    >
      <div className="item-info-box div-border shadow-lg">
        {
          info.ary.map((element, i)=>{
            return (
              <div
                key={`val-data ${i}`}
                className={state[element.state]}
              >
                {element.alias}:{element.value} {state_msg[element.state]}
              </div>
            )
          })
        }
        { info.memo &&
          <>
            <hr />
            <div className="font-normal">메모: {info.memo}</div>
          </>
        }
      </div>
    </div>
  )
}