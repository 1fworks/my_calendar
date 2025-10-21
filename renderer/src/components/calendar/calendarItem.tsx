import { useEffect, useState } from "react"
import { MdCancel } from "react-icons/md";
import { BiPlusCircle } from "react-icons/bi";
import { FaSave } from "react-icons/fa";
import { DividingLine } from "./dividingLine";
import { CanlendarItemDetail } from "./calendarItemDetail";
import { ItemInfo } from "./ItemInfo";
import { CalendarItemDataset, CalendarRulesInfo } from "./interface";
import lodash from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { save_file } from "@/lib/savload/save_file";
import my_dayjs from "@/lib/mydayjs";

export const Item = ({
  savfileSlot,
	itemDetail,
  detailTrigger,
  // setItem,
  resetCalendar,
}:{
  savfileSlot:number|string,
	itemDetail:CalendarItemDataset,
  detailTrigger: {
    val: string,
    reset: Function,
  },
  // setItem: (item:CalendarItemDataset)=>void
  resetCalendar: () => Promise<void>
}) => {
  const [ active, setActive ] = useState(false)
  const [ memoContent, setMemoContent ] = useState<string>(itemDetail.info.memo)
  const [ rules, setRules ] = useState<CalendarRulesInfo[]>(lodash.cloneDeep(itemDetail.info.ary))
  
  const save = async() => {
    console.log(rules)
    await save_file(savfileSlot, itemDetail.date, memoContent, itemDetail.info.favorite, lodash.cloneDeep(rules))
    await resetCalendar()
  }

  const closeDetail = () => {
    setActive(false)
    setMemoContent(itemDetail.info.memo)
    setRules(lodash.cloneDeep(itemDetail.info.ary))
  }

  const showDetail = () => {
    if(!active) {
      setActive(true)
    }
  }

  const addVariable = () => {
    const rule_ary: CalendarRulesInfo[] = lodash.cloneDeep(rules)
    rule_ary.push({
      uuid: uuidv4(),
      alias: `변수명 ${rules.length + 1}`,
      value: 0,
      state: 1, // update
      final_operation: {
        value: 0,
        operation: 1, // reset
      },
      rules: []
    })
    setRules(rule_ary)
  }

  const delVariable = (i:number) => {
    const rule_ary: CalendarRulesInfo[] = lodash.cloneDeep(rules)
    if(rule_ary.length > i) {
      rule_ary.splice(i, 1)
      setRules(rule_ary)
    }
  }

  const setRulesInfo = (i:number, rulesInfo: CalendarRulesInfo) => {
    const rule_ary: CalendarRulesInfo[] = lodash.cloneDeep(rules)
    if(rule_ary.length > i) {
      rule_ary[i] = rulesInfo
      setRules(rule_ary)
    }
  }

  useEffect(()=>{
    if(detailTrigger.val.length > 0 && itemDetail.date.format('YYYY-MM-DD') === detailTrigger.val) {
      showDetail()
      detailTrigger.reset()
    }
  }, [detailTrigger.val])

  useEffect(()=>{
    if(!lodash.isEqual(memoContent, itemDetail.info.memo))
      setMemoContent(itemDetail.info.memo)
    if(!lodash.isEqual(rules, itemDetail.info.ary))
      setRules(lodash.cloneDeep(itemDetail.info.ary))
  }, [itemDetail])

  const state = !lodash.isEqual(itemDetail.info.memo, memoContent) || !lodash.isEqual(itemDetail.info.ary, rules)
  const val_update = itemDetail.info.ary.map(info=>info.state > 0).filter(element=>element===true).length > 0
  const val_edit = itemDetail.info.ary.map(info=>info.final_operation.operation > 0).filter(element=>element===true).length > 0
  const isMyBirthday = (my_dayjs().format('YYYY-MM-DD') === itemDetail.date.format('YYYY-MM-DD'))

	return (
    <>
      <div
        className={`overlay ${active?'overlay-active':'hidden'}`}
        // onClick={closeDetail}
      > <div className="overlay-shadow-full" />
      { active &&
        <div className="overlay-box">
          <div className="w-full h-full relative p-2 cursor-default flex flex-col" onClick={e=>e.stopPropagation()}>
            <div className="w-full h-fit flex justify-between items-center mb-3">
              <div className="w-full flex flex-col mr-4">
                <div className={`date-text ${memoContent.length > 0 ? 'memo-underline':''}`}>
                  {itemDetail.date.format('LL')}
                </div>
                <span className={`text-sm text-right ${state ? 'text-rose-500' : 'opacity-0'}`}>{state ? '변경 사항 있음 (저장 안됨)' : ':)'}</span>
              </div>
              <button className="theme-switch mr-2" onClick={save}>
                <FaSave />
              </button>
              <button className="theme-switch" onClick={closeDetail}>
                <MdCancel />
              </button>
            </div>
            <div className="flex-1 relative">
              <div className="absolute w-full top-0 bottom-0 pr-1 overflow-y-scroll flex flex-col gap-4">
                <div className="div-border flex flex-col p-2">
                  <span className="w-fit mx-auto">메모</span>
                  <textarea className="memo h-52 p-1 div-border" value={memoContent} onChange={(e)=>{setMemoContent(e.target.value)}}/>
                </div>
                <DividingLine />
                <div className="flex flex-col">
                  <span className="text-center font-bold">{`< 전역 변수 관리 >`}</span>
                  { rules.length === 0 &&
                    <span className="text-center opacity-50">아직 아무 변수도 없습니다...</span>
                  }
                </div>
                {
                  rules.map((element, i)=>{
                    return (
                      <div key={`item d ${element.uuid}`} className="flex flex-col gap-1">
                        <CanlendarItemDetail
                          ruleDetail={element}
                          originalDetail={lodash.cloneDeep(itemDetail.info.ary[i])}
                          setRulesInfo={(rulesInfo:CalendarRulesInfo)=>{setRulesInfo(i, rulesInfo)}}
                          delVariable={()=>{delVariable(i)}}
                        />
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
        { (itemDetail.info.ary.length > 0 || itemDetail.info.memo.length > 0) &&
          <div className="item-overlay-shadow" />
        }
        <div className={`calendar-item ${itemDetail.isCurrMonth?'font-bold':'opacity-50'}`}>
          { (itemDetail.info.ary.length > 0 || itemDetail.info.memo.length > 0) &&
            <ItemInfo info={itemDetail.info} id={`slot-${itemDetail.date.format('YYYY-MM-DD')}`}/>
          }
          <button className={`calendar-circle ${itemDetail.info.memo.length > 0?'memo-underline':''}`} onClick={showDetail} disabled={itemDetail.loading}>
            <div className={`w-fit h-fit relative ${val_edit?'ping-edit':''} ${isMyBirthday?'font-extrabold scale-125 animate-pulse':''}`}>
              { val_update &&
                <div className="absolute ping -right-2 -top-1">
                  <div className="absolute ping animate-ping" />
                </div>
              }
              { itemDetail.loading &&
                <div className="absolute min-[480px]:size-8 size-6 left-1/2 top-1/2">
                  <div className="absolute min-[480px]:size-8 size-6 bg-gray-400 opacity-50 right-1/2 bottom-1/2 animate-spin rounded-md" />
                </div>
              }
              <div className={`w-full h-full ${itemDetail.info.memo.length > 0?'animate-bounce':''}`}>
                {itemDetail.date.format('D')}
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
	)
}