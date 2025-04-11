import { useEffect, useState } from "react"
import { CalendarItemInfo } from "./interface";

const info_margin = 10; // px
const state = ['', 'val-update', 'val-plus', 'val-minus']
const state_msg = ['', '(Update)', '(↑)', '(↓)']

export const ItemInfo = ({
  info,
  id
}:{
  info: CalendarItemInfo
  id: string
}) => {
  const [ pos, setPos ] = useState({
    left: 0,
    top: 0,
    origin: 'bottom'
  })

  const pos_init = () => {
    const target:HTMLDivElement = document.querySelector(`#${id}`)
    const W = window.innerWidth
    // const H = window.innerHeight
    const P_W = target.parentElement.clientWidth;
    const P_H = target.parentElement.clientHeight;
    const p_x = target.parentElement.offsetLeft;
    const p_y = target.parentElement.offsetTop;
    const w = target.clientWidth
    const h = target.clientHeight
    
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
    if(pos.left !== x - p_x || pos.top !== y - p_y) {
      setPos({
        left: x - p_x, top: y - p_y, origin: origin
      })
    }
  }

  useEffect(()=>{
    pos_init()
    window.addEventListener("resize", pos_init)
    return () => {
      window.removeEventListener("resize", pos_init)
    }
  }, [id, info])

  return (
    <div
      className="item-info"
      id={id}
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
                <span className="font-normal mr-1">{element.alias} =</span><span className="text-lg">{element.value!==undefined?element.value:'???'} {state_msg[element.state]}</span>
              </div>
            )
          })
        }
        { info.memo &&
          <>
            { info.ary.length > 0 &&
              <hr />
            }
            <div className="font-normal memo-content w-44 max-w-fit">메모: {info.memo}</div>
          </>
        }
      </div>
    </div>
  )
}