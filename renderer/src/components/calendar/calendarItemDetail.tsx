import { TiPlus, TiMinus } from "react-icons/ti";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { PiStarFourFill, PiArrowBendDownRightBold } from "react-icons/pi";
import { FaEquals, FaArrowLeft } from "react-icons/fa";
import { LuBookPlus } from "react-icons/lu";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { useEffect, useState } from "react";

const Rule = ({
  ruleData,
}:{
  ruleData: {
    rule: string,
    value: number[],
    operation: number
  },
}) => {
  return (
    <div className="div-border rule-box flex flex-col items-center">
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
          <input className="h-fit div-border max-w-10"></input>
          <span>월</span>
          <input className="h-fit div-border max-w-10"></input>
          <span>일 마다</span>
        </div>
      }
      { ruleData.rule === 'rule-2' && /* 매달 n일 */
        <div className="flex flex-row items-center justify-center">
          <span>매달</span>
          <input className="h-fit div-border max-w-10"></input>
          <span>일 마다</span>
        </div>
      }
      { ruleData.rule === 'rule-4' && /* 매주 *요일 */
        <div className="flex flex-row items-center justify-center">
          <span className="mr-2">매주</span>
          {
            ['월','화','수','목','금','토','일'].map((val, i)=>{
              return (
                <div className="flex flex-col items-center justify-center" key={`key ${val}`}>
                  <label>{val}</label>
                  <input type="checkbox" name={`n-${i}`} value={`n-${i}`} />
                </div>
              )
            })
          }
          <span className="ml-2">마다</span>
        </div>
      }
      { ruleData.rule === 'rule-6' && /* n일 간격으로 */
        <div className="flex flex-row items-center justify-center">
          <input className="h-fit div-border max-w-14"></input>
          <span>일 간격으로</span>
        </div>
      }
      <div className="flex flex-row items-center mb-1">
        <button className="mini-svg ml-auto flex flex-row">
          <FaArrowLeft/>{/* <TiMinus/><TiPlus/> */}
          <FaEquals/>
        </button>
        <input className="h-fit div-border"></input>
      </div>
    </div>
  )
}

export const CanlendarItemDetail = () => {
  const [ inputVal, setInputVal ] = useState<string>('휴가')
  const [ openRule, setOpenRule ] = useState<boolean>(false)
  const [ ruleDetail, setRuleDetail ] = useState([
    {
      rule: 'rule-1',
      value: [1, 1, 1, 1, 1, 1, 1],
      operation: 0
    },
    {
      rule: 'rule-2',
      value: [1, 1, 1, 1, 1, 1, 1],
      operation: 0
    },
    {
      rule: 'rule-3',
      value: [1, 1, 1, 1, 1, 1, 1],
      operation: 0
    },
    {
      rule: 'rule-4',
      value: [1, 1, 1, 1, 1, 1, 1],
      operation: 0
    },
    {
      rule: 'rule-5',
      value: [1, 1, 1, 1, 1, 1, 1],
      operation: 0
    },
    {
      rule: 'rule-6',
      value: [1, 1, 1, 1, 1, 1, 1],
      operation: 0
    }
  ])

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
          <input className="div-border"></input>
        </div>
        <button className="theme-switch ml-auto"><RiDeleteBin2Fill/></button>

      </div>

      <button
        className="w-full mini-svg flex flex-row items-center z-10"
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
            ruleDetail.map((element, i)=>{
              return (
                <div key={`rule ${i}`}>
                  <Rule ruleData={element}/>
                </div>
              )
            })
          }
          <button className="w-full mini-svg flex flex-row items-center justify-center">
            <LuBookPlus />
            <span>add rule</span>
          </button>
        </div>
      }
    </div>
  )
}