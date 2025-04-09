import { useEffect, useState } from "react"
import { MdCancel } from "react-icons/md";
import { BiPlusCircle } from "react-icons/bi";
import { FaSave } from "react-icons/fa";
import { DividingLine } from "./dividingLine";
import { CanlendarItemDetail } from "./calendarItemDetail";
import { ItemInfo } from "./ItemInfo";
import { CalendarItemDataset, CalendarRule, CalendarRulesInfo } from "./interface";
import lodash from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export const Item = ({
	itemDetail,
  detailTrigger,
  // setItem,
  resetCalendar,
}:{
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
  
  const save = () => {
    console.log(`save-${itemDetail.date.format('YYYY-MM-DD')}:${memoContent}`)
    resetCalendar()
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
              <div className="absolute w-full top-0 bottom-0 pr-1 overflow-y-scroll flex flex-col gap-4">
                <div className="div-border flex flex-col p-2">
                  <span className="w-fit mx-auto">메모</span>
                  <textarea className="memo p-1 div-border" value={memoContent} onChange={(e)=>{setMemoContent(e.target.value)}}/>
                </div>
                <DividingLine />
                {
                  rules.map((element, i)=>{
                    return (
                      <div key={`item d ${element.uuid}`} className="flex flex-col gap-1">
                        <CanlendarItemDetail
                          ruleDetail={element}
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
          <button className={`calendar-circle ${itemDetail.info.memo.length > 0?'underline underline-offset-4 decoration-2 decoration-rose-500':''}`} onClick={showDetail}>
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