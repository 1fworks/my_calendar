import { Dayjs } from "dayjs"
import { useState } from "react"
import { MdCancel } from "react-icons/md";
import { BiPlusCircle } from "react-icons/bi";
import { FaSave } from "react-icons/fa";
import { DividingLine } from "./dividingLine";
import { CanlendarItemDetail } from "./calendarItemDetail";
import { ItemInfo } from "./ItemInfo";

const info_dummy_data = {
  ary: [
    {
      alias: 'alias',
      value: 100,
      state: 0, // normal update plus minus
    },
    {
      alias: 'alias',
      value: 100,
      state: 1,
    },
    {
      alias: 'alias',
      value: 100,
      state: 2,
    },
    {
      alias: 'alias',
      value: 100,
      state: 3,
    }
  ],
  memo: 'test memo'
}

export const Item = ({
	isCurrMonth,
	date,
}:{
	isCurrMonth:boolean,
	date:Dayjs,
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
              <button className="theme-switch">
                <FaSave />
              </button>
              <div className="w-full flex flex-row justify-center items-center">
                <div className="date-text">
                  {date.format('LL')}
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
                  [1, 2, 3].map((element, i)=>{
                    return (
                      <div key={`item d ${i}`} className="flex flex-col gap-1">
                        <CanlendarItemDetail />
                        <DividingLine />
                      </div>
                    )
                  })
                }
                <button className="w-full mini-svg flex flex-row items-center justify-center">
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
        <div className={`calendar-item ${isCurrMonth?'font-bold':'opacity-50'}`}>
          <ItemInfo info={info_dummy_data}/>
          <button className={`calendar-circle ${'underline underline-offset-4 decoration-2'}`} onClick={showDetail}>
            <div className="w-fit h-fit relative">
              <div className="ping -right-2 -top-1">
                <div className="ping animate-ping" />
              </div>
              {date.format('D')}
            </div>
          </button>
        </div>
      </div>
    </>
	)
}