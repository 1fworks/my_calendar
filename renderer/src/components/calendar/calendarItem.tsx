import { useEffect, useState } from "react"
import { MdCancel } from "react-icons/md";
import { BiPlusCircle } from "react-icons/bi";
import { FaSave } from "react-icons/fa";
import { DividingLine } from "./dividingLine";
import { CanlendarItemDetail } from "./calendarItemDetail";
import { ItemInfo } from "./ItemInfo";
import { CalendarItemDataset } from "./interface";

export const Item = ({
	itemDetail,
  detailTrigger,
  update,
}:{
	itemDetail:CalendarItemDataset,
  detailTrigger: {
    val: string,
    reset: Function,
  },
  update: ()=>Promise<void>
}) => {
  const [ active, setActive ] = useState(false)

  const closeDetail = () => {
    setActive(false)
  }

  const showDetail = () => {
    if(!active) {
      setActive(true)
    }
  }

  const addVariable = () => {

  }

  const save = () => {
    update()
  }

  useEffect(()=>{
    if(detailTrigger.val.length > 0 && itemDetail.date.format('YYYY-MM-DD') === detailTrigger.val) {
      showDetail()
      detailTrigger.reset()
    }
  }, [detailTrigger.val])

	return (
    <>
      <div
        className={`overlay ${active?'overlay-active':'hidden'}`}
        // onClick={closeDetail}
      > <div className="overlay-shadow-full" />
      { active &&
        <div className="overlay-box">
          <div className="w-full h-full relative p-2 cursor-default flex flex-col" onClick={e=>e.stopPropagation()}>
            <div className="w-full h-fit flex justify-between mb-3">
              <button className="theme-switch" onClick={save}>
                <FaSave />
              </button>
              <div className="w-full flex flex-row justify-center items-center">
                <div className="date-text">
                  {itemDetail.date.format('LL')}
                </div>
              </div>
              <button className="theme-switch" onClick={closeDetail}>  
                <MdCancel />
              </button>
            </div>
            <div className="flex-1 relative">
              <div className="absolute w-full top-0 bottom-0 pr-1 overflow-y-scroll flex flex-col gap-1">
                <div className="div-border flex flex-col p-2">
                  <span className="w-fit mx-auto">메모</span>
                  <textarea className="memo div-border"/>
                </div>
                <DividingLine />
                {
                  itemDetail.info.ary.map((element, i)=>{
                    return (
                      <div key={`item d ${i}`} className="flex flex-col gap-1">
                        <CanlendarItemDetail ruleDetail={element} />
                        <DividingLine />
                      </div>
                    )
                  })
                }
                <button className="w-full mini-svg flex flex-row items-center justify-center" onClick={addVariable}>
                  <span>- - - </span>
                  <BiPlusCircle />
                  <span>add new variable - - -</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      </div>
      {/* ----------------------------------------------------- */}
      <div className="calendar-item-cover w-full h-full">
        <div className="item-overlay-shadow" />
        <div className={`calendar-item ${itemDetail.isCurrMonth?'font-bold':'opacity-50'}`}>
          <ItemInfo info={itemDetail.info} id={`slot-${itemDetail.date.format('YYYY-MM-DD')}`}/>
          <button className={`calendar-circle ${itemDetail.info.memo.length > 0?'underline underline-offset-4 decoration-2':''}`} onClick={showDetail}>
            <div className="w-fit h-fit relative">
              { true && itemDetail.info.ary.map(info=>info.state > 0).filter(element=>element===true).length > 0 &&
                <div className="ping -right-2 -top-1">
                  <div className="ping animate-ping" />
                </div>
              }
              {itemDetail.date.format('D')}
            </div>
          </button>
        </div>
      </div>
    </>
	)
}