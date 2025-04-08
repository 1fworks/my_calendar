import { FaRegNoteSticky } from "react-icons/fa6";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import { useEffect, useState } from "react";
import { CalendarItemDataset } from "./calendar/calendar";

export const NoteBook = ({items}:{items:CalendarItemDataset[]}) => {
  const [ active, setActive ] = useState<boolean>(false)

	return (
    <>
      <div
        className={`overlay ${active?'overlay-active cursor-pointer':''}`}
        onClick={()=>{
          if(active) setActive(false)
        }}
      >
        <div className="overlay-shadow" />
        <div className="drawer" onClick={e=>e.stopPropagation()}>
          { active && 
            <div className="w-full h-full flex flex-col gap-2">
              <div className="w-full ml-auto pt-2 pl-4 pr-2 flex flex-row items-center gap-2">
                <span className="flex-1 font-bold text-lg">메모지</span>
                <button
                  className="theme-switch"
                  onClick={()=>{
                    if(active) setActive(false)
                  }}
                >
                  <MdCancel />
                </button>
              </div>
              <div className="relative flex-1 overflow-y-scroll mr-2 pb-3">
                <div className="flex flex-col gap-2">
                  { items.map((item, i)=>{
                    if(item.info.memo.length > 0)
                    return (
                      <div
                        className={`${item.info.favorite?'':'item-detail'} mx-2 p-2 div-border mini-svg h-fit flex flex-row gap-2`}
                        key={`memo - ${i}`}
                      >
                        <div className="w-fit h-fit">
                          <button className="theme-switch">
                            {item.info.favorite?<FaHeart />:<FaHeartBroken />}
                          </button>
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="text-sm">
                            {item.date.format('LL')}
                          </div>
                          <div className="memo-content">
                            {item.info.memo}
                          </div>
                        </div>
                        <div className="w-fit h-fit">
                          <button className="theme-switch"><FiEdit /></button>
                        </div>
                      </div>
                    )}).filter(element=>element!==undefined)
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      <button
        className="theme-switch"
        onClick={()=>{
          setActive(!active)
        }}
      >
        <FaRegNoteSticky />
      </button>
    </>
	)
}