import { TiPlus, TiMinus } from "react-icons/ti";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { PiStarFourFill, PiArrowBendDownRightBold } from "react-icons/pi";
import { FaEquals, FaArrowLeft } from "react-icons/fa";
import { LuBookPlus } from "react-icons/lu";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { useEffect, useState } from "react";
import { CalendarRule, CalendarRulesInfo } from "./calendar";

const Rule = ({
  ruleData,
}:{
  ruleData: CalendarRule,
}) => {
  return (
    <div className="div-border div-border-l-8 rule-box flex flex-col items-center">
      <div className="w-full flex flex-row items-center">
        <div className="mini-svg">
          <PiArrowBendDownRightBold />
        </div>
        <div className="ml-2 w-full h-fit">
          <select className="div-border" value={ruleData.rule} name="rule" onChange={(e)=>{console.log(e.target.value)}}>
            <option value='rule-1'>매년 n월 n일</option>
            <option value='rule-2'>매달 n일</option>
            <option value='rule-3'>매달 마지막 날</option>
            <option value='rule-4'>매주 *요일</option>
            <option value='rule-5'>매일</option>
            <option value='rule-6'>n일 간격으로</option>
          </select>
        </div>
        <button className="mini-svg ml-auto"><RiDeleteBin2Fill/></button>
      </div>
      { ruleData.rule === 'rule-1' && /* 매년 n월 n일 */
        <div className="flex flex-row items-center justify-center">
          <span>매년</span>
          <input type="number" min="1" max="12" className="h-fit div-border max-w-16"></input>
          <span>월</span>
          <input type="number" min="1" max="31" className="h-fit div-border max-w-16"></input>
          <span>일 마다</span>
        </div>
      }
      { ruleData.rule === 'rule-2' && /* 매달 n일 */
        <div className="flex flex-row items-center justify-center">
          <span>매달</span>
          <input type="number" min="1" max="31" className="h-fit div-border max-w-16"></input>
          <span>일 마다</span>
        </div>
      }
      { ruleData.rule === 'rule-4' && /* 매주 *요일 */
        <div className="flex flex-row gap-[0.1rem] items-center justify-center mb-2">
          <span className="mr-1">매주</span>
          {
            ['월','화','수','목','금','토','일'].map((val, i)=>{
              return (
                <div className="flex flex-col items-center justify-center" key={`key ${val}`}>
                  <label>{val}</label>
                  <input className="size-4" type="checkbox" name={`n-${i}`} value={`n-${i}`} />
                </div>
              )
            })
          }
          <span className="ml-1">마다</span>
        </div>
      }
      { ruleData.rule === 'rule-6' && /* n일 간격으로 */
        <div className="flex flex-row items-center justify-center">
          <input type="number" min="1" className="h-fit div-border max-w-20"></input>
          <span>일 간격으로</span>
        </div>
      }
      <div className="flex flex-row items-center mb-1">
        <button className="mini-svg ml-auto flex flex-row">
          <FaArrowLeft/>{/* <TiMinus/><TiPlus/> */}
          <FaEquals/>
        </button>
        <input type="number" className="h-fit div-border"></input>
      </div>
    </div>
  )
}

export const CanlendarItemDetail = ({ruleDetail}:{ruleDetail:CalendarRulesInfo}) => {
  const [ inputVal, setInputVal ] = useState<string>(ruleDetail.alias)
  const [ openRule, setOpenRule ] = useState<boolean>(false)

  return (
    <div className="item-detail flex flex-col gap-1">
      <div className="div-border rule-box-main rule-box flex flex-row items-center">

        <div className="w-fit flex flex-row items-center">
          <div className="mini-svg">
            <PiStarFourFill/>
          </div>
          <input className="ml-1 mr-2 font-bold text-nowrap max-w-20 div-border" value={inputVal} onChange={e=>setInputVal(e.target.value)} />
          <button className="mini-svg ml-auto flex flex-row">
            <FaArrowLeft/>{/* <TiMinus/><TiPlus/> */}
            <FaEquals/>
          </button>
          <input type="number" className="div-border"></input>
        </div>
        <button className="theme-switch ml-auto"><RiDeleteBin2Fill/></button>

      </div>

      <button
        className="w-full div-border-l-8 mini-svg flex flex-row items-center z-10"
        onClick={()=>{
          setOpenRule(!openRule)
        }}
      >
        { openRule?<MdKeyboardArrowUp />:<MdKeyboardArrowDown /> }
        <span>{openRule?'close':'open'} rules</span>
      </button>
      { openRule &&
        <div className="flex flex-col gap-1 animate-climb100-animation">
          {
            ruleDetail.rules.map((element, i)=>{
              return (
                <div key={`rule ${i}`}>
                  <Rule ruleData={element}/>
                </div>
              )
            })
          }
          <button className="w-full div-border-l-8 mini-svg flex flex-row items-center justify-center">
            <LuBookPlus />
            <span>add rule</span>
          </button>
        </div>
      }
    </div>
  )
}