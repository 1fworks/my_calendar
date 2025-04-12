import { FaRegNoteSticky } from "react-icons/fa6";
import { FaHeart, FaHeartBroken, FaCheck } from "react-icons/fa";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CalendarItemDataset } from "./interface";
import { heart_toggle } from "@/lib/savload/save_file";
import { Dayjs } from "dayjs";
import lodash from 'lodash';
import my_dayjs from "@/lib/mydayjs";

const state = ['', 'val-update', 'val-plus', 'val-minus']
const state_msg = ['', '(Update)', '(↑)', '(↓)']

export const NoteBook = ({
  items,
  savfileSlot,
  setDetailTrigger,
  resetCalendarData,
  date,
  prevPage,
  nextPage,
}:{
  items:CalendarItemDataset[],
  savfileSlot:number,
  setDetailTrigger:Dispatch<SetStateAction<string>>,
  resetCalendarData: () => Promise<void>
  date:string,
  prevPage:()=>void,
  nextPage:()=>void,
}) => {
  const [ active, setActive ] = useState<boolean>(false)
  const [ memos, setMemos ] = useState(lodash.cloneDeep(items))
  const [ category, setCategory ] = useState<number>(0)

  useEffect(()=>{
    setMemos(items.map(item=>{
      return item
    }).sort((a, b)=>{
      if(a.info.favorite && b.info.favorite) return 0
      else if(a.info.favorite) return -1
      else return 1
    }))
  }, [items])

  useEffect(()=>{
    if(!active && !lodash.isEqual(memos, items)) {
      resetCalendarData()
    }
  }, [active])

  const heartToggle = async(date: Dayjs, i: number) => {
    await heart_toggle(savfileSlot, date)
    const newMemos = lodash.cloneDeep(memos)
    newMemos[i].info.favorite = !newMemos[i].info.favorite
    setMemos(newMemos)
    // await resetCalendarData()
  }

  const openDetailPage = (data: CalendarItemDataset) => {
    setDetailTrigger(data.date.format('YYYY-MM-DD'))
    setActive(false)
  }

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
              <div className="w-full ml-auto pt-2 pl-2 pr-2 flex flex-row gap-2">
                <div className="flex-1 flex flex-row gap-2">
                  <button className="div-border py-1 px-3" onClick={()=>{setCategory(0)}}>
                    <div className="font-bold text-lg memo-underline flex flex-row items-center gap-1">
                      { category===0 && <FaCheck /> }
                      <span className={category===0?'':'opacity-50'}>
                        메모지
                      </span>
                    </div>
                  </button>
                  <button className="div-border py-1 px-3" onClick={()=>{setCategory(1)}}>
                    <div className="font-bold text-lg flex flex-row items-center gap-1">
                      { category===1 && <FaCheck /> }
                      <span className={category===1?'':'opacity-50'}>
                        변수
                      </span>
                    </div>
                  </button>
                </div>
                <button
                  className="theme-switch"
                  onClick={()=>{
                    if(active) setActive(false)
                  }}
                >
                  <MdCancel />
                </button>
              </div>
              <div className="px-2 flex flex-row justify-center items-center">
                <button className="super-mini-svg" onClick={prevPage}><BsChevronLeft /></button>
                <span className="px-2">{my_dayjs(date).format('YYYY MMMM')}</span>
                <button className="super-mini-svg" onClick={nextPage}><BsChevronRight /></button>
              </div>
              <div className="relative flex-1 overflow-y-scroll mr-2 pb-3">
                <div className="flex flex-col gap-2">
                  { category===0 && memos.map((item, i)=>{
                    if(item.info.memo.length > 0)
                    return (
                      <div
                        className={`${item.info.favorite?'':'item-detail'} mx-2 p-2 div-border mini-svg h-fit flex flex-row gap-2`}
                        key={`memo - ${i}`}
                      >
                        <div className="w-fit h-fit">
                          <button className="theme-switch" onClick={async()=>{await heartToggle(item.date, i)}}>
                            {item.info.favorite?<FaHeart className="fill-rose-500" />:<FaHeartBroken />}
                          </button>
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="text-sm">
                            {item.date.format('LL')}
                          </div>
                          <div className={`memo-content ${item.info.favorite ? 'font-bold' : ''}`}>
                            {item.info.memo}
                          </div>
                        </div>
                        <div className="w-fit h-fit">
                          <button className="theme-switch" onClick={()=>{openDetailPage(item)}}><FiEdit /></button>
                        </div>
                      </div>
                    )}).filter(element=>element!==undefined)
                  }
                  {
                    category===1 && memos.map((item, i)=>{
                      return (
                        <div
                          className={`mx-2 p-2 div-border mini-svg h-fit flex flex-row gap-2`}
                          key={`variable - ${i}`}
                        >
                          <div className="flex-1 flex flex-col">
                            <div className="text-sm">
                              {item.date.format('LL')}
                            </div>
                            {
                              item.info.ary.map(v=>{
                                return (
                                  <div className={`memo-content ${item.info.favorite ? 'font-bold' : ''}`}>
                                    <span className="font-normal mr-1">• {v.alias}:</span>
                                    <span className={state[v.state]}>{v.value} {state_msg[v.state]}</span>
                                  </div>
                                )
                              })
                            }
                          </div>
                          <div className="w-fit h-fit">
                            <button className="theme-switch" onClick={()=>{openDetailPage(item)}}><FiEdit /></button>
                          </div>
                        </div>
                      )
                    })
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