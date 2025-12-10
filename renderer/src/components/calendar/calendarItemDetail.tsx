import { TiPlus, TiMinus } from "react-icons/ti";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { PiStarFourFill, PiArrowBendDownRightBold } from "react-icons/pi";
import { FaSquareCaretUp, FaSquareCaretDown } from "react-icons/fa6";
import { ImSpinner11 } from "react-icons/im";
import { FaEquals } from "react-icons/fa";
import { LuBookPlus } from "react-icons/lu";
import { SiEducative } from "react-icons/si";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { ChangeEvent, useEffect, useState } from "react";
import { CalendarRule, CalendarRulesInfo } from "./interface";
import lodash from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import my_dayjs from "@/lib/mydayjs";
import { DelModal } from "./delModal";

const Rule = ({
  num,
  maxnum,
  ruleData,
  original,
  updateRule,
  deleteRule,
  changeRule,
}:{
  num: number,
  maxnum: number,
  ruleData: CalendarRule,
  original: CalendarRule,
  updateRule: (CalendarRule:CalendarRule)=>void,
  deleteRule: ()=>void,
  changeRule: (option:number)=>void,
}) => {
  const [ modalActive, setModalActive ] = useState<boolean>(false)
  const [ ruleType, setRuleType ] = useState<string>(ruleData.ruleType)
  const [ ruleVal, setRuleVal ] = useState<string[]>(ruleData.ruleVal.map(val=>{return val.toString()}))
  const [ value, setValue ] = useState<string>(ruleData.value.toString())
  const [ oper, setOper ] = useState<number>(ruleData.operation)

  const str_to_int = (str:string) => {
    let result = parseInt(str)
    if(isNaN(result)) result = 0
    return result
  }

  const change_ruleVal = (e:ChangeEvent<HTMLInputElement>, num: number) => {
    const val = e.target.value?e.target.value:''
    const result = lodash.cloneDeep(ruleVal)
    result[num] = val
    setRuleVal(result)
  }

  const change_ruleVal_checkbox = (e:ChangeEvent<HTMLInputElement>, num: number) => {
    const val = e.target.checked?'1':'0'
    const result = lodash.cloneDeep(ruleVal)
    result[num] = val
    setRuleVal(result)
  }

  useEffect(()=>{
    const val = str_to_int(value)
    const rule_val = ruleVal.map(element=>{return str_to_int(element)})
    if(ruleType === 'rule-1') {
      rule_val[0] = Math.min(Math.max(rule_val[0], 1), 12)
      rule_val[1] = Math.min(Math.max(rule_val[1], 1), 31)
    }
    else if(ruleType === 'rule-2') {
      rule_val[0] = Math.min(Math.max(rule_val[0], 1), 31)
    }
    else if(ruleType === 'rule-6') {
      rule_val[3] = Math.max(rule_val[3], 1)
    }
    if(
      !lodash.isEqual(ruleType, ruleData.ruleType) ||
      !lodash.isEqual(rule_val, ruleData.ruleVal) ||
      !lodash.isEqual(val, ruleData.value) ||
      !lodash.isEqual(oper, ruleData.operation)
    ){
      updateRule({
        uuid: ruleData.uuid,
        ruleType: ruleType,
        ruleVal: rule_val,
        value: val,
        operation: oper
      })
    }
  }, [ruleType, ruleVal, value, oper])

  return (
    <div className="div-border div-border-l-8 rule-box flex flex-col items-center">
      <div className="w-full flex flex-row items-center">
        <div className="mini-svg">
          <PiArrowBendDownRightBold />
        </div>
        <div className="ml-2 w-full h-fit flex flex-row">
          <select className="div-border" value={ruleType} name="rule" onChange={(e)=>{
              setRuleType(e.target.value)
              if(e.target.value !== 'rule-4')
                setRuleVal(['1', '1', '1', '1', '1', '1', '1'])
              else
                setRuleVal(['0', '0', '0', '0', '0', '0', '0'])
            }}
          >
            <option value='rule-1'>매년 n월 n일</option>
            <option value='rule-2'>매달 n일</option>
            <option value='rule-3'>매달 마지막 날</option>
            <option value='rule-4'>매주 *요일</option>
            <option value='rule-5'>매일</option>
            <option value='rule-6'>n일 간격으로</option>
          </select>
        </div>
        <button className="mini-svg ml-auto" onClick={()=>{setModalActive(true)}}><RiDeleteBin2Fill/></button>
        { modalActive &&
          <DelModal
            closeModal={()=>{setModalActive(false)}}
            delFunc={()=>{deleteRule()}}
          />
        }
      </div>

      { ruleType === 'rule-1' && /* 매년 n월 n일 */
        <div className="flex flex-row items-center justify-center">
          <span>매년</span>
          <input type="number" min="1" max="12" className="h-fit div-border max-w-16"
            value={ ruleVal[0] }
            onChange={e=>{change_ruleVal(e, 0)}}
          />
          <span>월</span>
          <input type="number" min="1" max="31" className="h-fit div-border max-w-16"
            value={ ruleVal[1] }
            onChange={e=>{change_ruleVal(e, 1)}}
          />
          <span>일 마다</span>
        </div>
      }
      { ruleType === 'rule-2' && /* 매달 n일 */
        <div className="flex flex-row items-center justify-center">
          <span>매달</span>
          <input type="number" min="1" max="31" className="h-fit div-border max-w-16"
            value={ ruleVal[0] }
            onChange={e=>{change_ruleVal(e, 0)}}
          />
          <span>일 마다</span>
        </div>
      }
      { ruleType === 'rule-4' && /* 매주 *요일 */
        <div className="flex flex-row gap-[0.1rem] items-center justify-center mb-2">
          <span className="mr-1">매주</span>
          {
            ['일','월','화','수','목','금','토'].map((val, i)=>{
              return (
                <div className="flex flex-col items-center justify-center" key={`key ${val}`}>
                  <label>{val}</label>
                  <input className="size-4" type="checkbox" name={`n-${i}`} value={`n-${i}`}
                    checked={ parseInt(ruleVal[i])>0 }
                    onChange={e=>{change_ruleVal_checkbox(e, i)}}
                  />
                </div>
              )
            })
          }
          <span className="ml-1">마다</span>
        </div>
      }
      { ruleType === 'rule-6' && /* n일 간격으로 */
        <div className="flex flex-col items-start justify-center gap-1">
          <div className="flex flex-row items-center justify-center">
            <input type="date" className={`h-fit div-border ${(parseInt(ruleVal[0])>=1900 && parseInt(ruleVal[1])>0 && parseInt(ruleVal[2])>0) ? '' : 'err-border'}`}
              value={ !original || !lodash.isEqual(original.ruleVal.slice(0, 3).map(val=>{return val.toString()}), ruleVal.slice(0, 3)) ?
                undefined :
                ((parseInt(ruleVal[0])>=1900 && parseInt(ruleVal[1])>0 && parseInt(ruleVal[2])>0) ? my_dayjs(`${ruleVal[0]}-${ruleVal[1]}-${ruleVal[2]}`).format('YYYY-MM-DD') : undefined)
              }
              onChange={e=>{
                const tmp = e.target.value.split('-')
                if(tmp.length > 0) {
                  const result = lodash.cloneDeep(ruleVal)
                  result[0] = tmp[0]
                  result[1] = tmp[1]
                  result[2] = tmp[2]
                  setRuleVal(result)
                }
              }}
            />
            <span> 부터</span>
          </div>
          <div className="flex flex-row items-center justify-center">
            <input type="number" min="1" className="h-fit div-border max-w-20"
              value={ ruleVal[3] }
              onChange={e=>{change_ruleVal(e, 3)}}
            />
            <span>일 간격으로</span>
          </div>
        </div>
      }
      <div className="flex flex-row items-center mb-1 mt-1">
        
        { original !== undefined && (original.operation !== oper || original.value.toString() !== value) && // rollback
          <button className="super-mini-svg mr-1" onClick={()=>{
            setOper(original.operation)
            setValue(original.value.toString())
          }}>
            <ImSpinner11 />
          </button>
        }
        <button className="mini-svg ml-auto flex flex-row items-center pr-2" onClick={()=>{
          let tmp = (oper + 1)%4
          if(tmp === 0) tmp = 1
          setOper(tmp)
        }}>
          {oper<2?
            <><FaEquals/><span>값 초기화</span></>
          :(oper===2?
            <><TiPlus/><span>증가</span></>
          :
            <><TiMinus/><span>감소</span></>
          )}
        </button>
        <input type="number" className="h-fit div-border"
          value={value} onChange={(e)=>{setValue(e.target.value?e.target.value:'')}}
        />
      </div>
      <div className="flex flex-row items-center m-1 div-border py-1 px-2 mr-auto">
        <span>계산 순서: {num}</span>
        <button className={`super-mini-svg ml-3 mr-1 ${num === maxnum?'opacity-50 cursor-default':''}`} onClick={()=>{
          if(num !== maxnum) changeRule(0)
        }}><FaSquareCaretUp /></button>
        <button className={`super-mini-svg ${num === 1?'opacity-50 cursor-default':''}`} onClick={()=>{
          if(num !== 1) changeRule(1)
        }}><FaSquareCaretDown /></button>
      </div>
    </div>
  )
}

export const CanlendarItemDetail = ({
  ruleDetail,
  originalDetail,
  delVariable,
  setRulesInfo,
}:{
  ruleDetail: CalendarRulesInfo,
  originalDetail: CalendarRulesInfo,
  delVariable: Function,
  setRulesInfo: (rulesInfo:CalendarRulesInfo) => void
}) => {
  const [ modalActive, setModalActive ] = useState<boolean>(false)
  const [ openRule, setOpenRule ] = useState<boolean>(false)
  const [ alias, setAlias ] = useState<string>(ruleDetail.alias)
  const [ f_value, setF_value ] = useState<string>(ruleDetail.final_operation.value.toString())
  const [ oper, setOper ] = useState<number>(ruleDetail.final_operation.operation)
  const [ rules, setRules ] = useState<CalendarRule[]>(lodash.cloneDeep(ruleDetail.rules))

  useEffect(()=>{
    let value = parseInt(f_value)
    if(isNaN(value)) value = 0

    if(
      !lodash.isEqual(alias, ruleDetail.alias) ||
      !lodash.isEqual(value, ruleDetail.final_operation.value) ||
      !lodash.isEqual(oper, ruleDetail.final_operation.operation) ||
      !lodash.isEqual(rules, ruleDetail.rules)
    ) {
      const result = lodash.cloneDeep({
        uuid: ruleDetail.uuid,
        alias: alias,
        value: ruleDetail.value,
        state: ruleDetail.state,
        final_operation: {
          value: value,
          operation: oper,
        },
        rules: rules
      })
      setRulesInfo(result)
    }
  }, [f_value, oper, rules, alias])

  const updateRule = (rule: CalendarRule, i: number) => {
    const newRules:CalendarRule[] = lodash.cloneDeep(rules)
    newRules[i] = lodash.cloneDeep(rule)
    setRules(newRules)
  }

  const changeRule = (i:number, option:number) => {
    let target = i-1
    if(option === 1) target = i+1
    if(target < 0 || target >= rules.length) return;
    const newRules:CalendarRule[] = lodash.cloneDeep(rules)
    const tmp = newRules[target]
    newRules[target] = newRules[i]
    newRules[i] = tmp
    setRules(newRules)
  }

  const addRule = () => {
    const newRules:CalendarRule[] = lodash.cloneDeep(rules)
    newRules.push({
      uuid: uuidv4(),
      ruleType: 'rule-1',
      ruleVal: [1, 1, 1, 1, 1, 1, 1],
      value: 0,
      operation: 1,
    })
    setRules(newRules)
    if(!openRule) setOpenRule(true)
  }

  const delVar = () => {
    delVariable()
  }

  const delRule = (i:number) => {
    const newRules:CalendarRule[] = lodash.cloneDeep(rules)
    if(newRules.length > i) {
      newRules.splice(i, 1)
      setRules(newRules)
    }
  }

  return (
    <div className="item-detail flex flex-col gap-1">
      <div className="div-border rule-box-main rule-box flex flex-col gap-1">

        <div className="w-full flex flex-row items-center p-1 pb-0">
          <div className="theme-switch">
            <PiStarFourFill/>
          </div>
          <input className="ml-1 mr-2 p-1 text-lg font-bold text-nowrap max-w-36 div-border" value={alias} onChange={e=>setAlias(e.target.value)} />
          <div className="w-full flex items-end">
            <button className="theme-switch ml-auto" onClick={()=>{setModalActive(true)}}><RiDeleteBin2Fill/></button>
            { modalActive &&
              <DelModal
                closeModal={()=>{setModalActive(false)}}
                delFunc={delVar}
              />
            }
          </div>
        </div>
        
        <div className="flex flex-row justify-center p-1 ping-edit">
          {
            originalDetail !== undefined && ( originalDetail.final_operation.operation !== oper || originalDetail.final_operation.value.toString() !== f_value)
            && // rollback
            <button
              className="super-mini-svg mr-1"
              onClick={()=>{
                setOper(originalDetail.final_operation.operation)
                setF_value(originalDetail.final_operation.value.toString())
              }}
            ><ImSpinner11 /></button>
          }
          { oper !== 0 &&
            <button className="super-mini-svg mr-1" onClick={()=>{setOper(0)}}><SiEducative /></button>
          }
          <button className="mini-svg mr-1 flex flex-row items-center" onClick={()=>{
            setOper((oper+1) % 4)
          }}>
            {/* <FaEquals/>
             <FaArrowLeft />*/}
            { oper === 0 && <><SiEducative/><span className="mr-2">규칙 계산만 처리</span></> }
            { oper === 1 && <><FaEquals/><span className="mr-2">값 초기화</span></> }
            { oper === 2 && <><TiPlus/><span className="mr-2">증가</span></> }
            { oper === 3 && <><TiMinus/><span className="mr-2">감소</span></> }
          </button>
          { oper > 0 &&
            <>
              <input type="number" className="div-border max-w-52 input-mx0"
                value={f_value} onChange={e=>{setF_value(e.target.value?e.target.value:'')}}
              />
              <div className="ml-1 ping">
                <div className="ping animate-ping" />
              </div>
            </>
          }
        </div>
        { openRule &&
          <span className="text-center">↑ 마지막 계산 ↑</span>
        }

        <hr className="item-hr mx-1"/>

        <div className="flex flex-col gap-2 pt-1 p-1">
          <button
            className="w-fit pr-5 div-border-l-8 mini-svg flex flex-row items-center z-10"
            onClick={()=>{
              setOpenRule(!openRule)
            }}
          >
            { openRule?<MdKeyboardArrowUp />:<MdKeyboardArrowDown /> }
            <span>{openRule?'close':'open'} rules</span>
          </button>
          { openRule &&
            <div className="flex flex-col gap-2 animate-climb100-animation">
              {
                rules.map((element, i)=>{
                  const idx = (originalDetail?.rules) ? originalDetail.rules.map(rule=>rule.uuid).indexOf(element.uuid) : -1
                  return (
                    <div key={`rule ${element.uuid}`}>
                      <Rule
                        num={rules.length - i}
                        maxnum={rules.length}
                        changeRule={(option:number)=>{changeRule(i, option)}}
                        original={idx > -1 ? originalDetail.rules[idx] : undefined}
                        updateRule={(rule:CalendarRule)=>{updateRule(rule, i)}}
                        deleteRule={()=>{delRule(i)}}
                        ruleData={element}
                      />
                    </div>
                  )
                })
              }
              {
                rules.length === 0 && <span className="pl-1 opacity-50">아직 아무 규칙도 없어요..</span>
              }
              <button className="w-full div-border-l-8 mini-svg flex flex-row items-center justify-center" onClick={addRule}>
                <LuBookPlus />
                <span>규칙 추가</span>
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  )
}