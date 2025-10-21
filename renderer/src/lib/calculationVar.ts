import { CalendarItemDatasetWithDateISOString, CalendarRule, CalendarRulesInfo } from "@/components/calendar/interface";
import { Dayjs } from "dayjs";
import my_dayjs from "./mydayjs";
import lodash from 'lodash';

const get_reset_value = (date: Dayjs, rules: CalendarRule[]) => {
  let value = 0
  rules.forEach(rule => {
    let check = false
    if(rule.ruleType === 'rule-1'){ // 매년 n월 n일
      if(date.month()+1 === rule.ruleVal[0] && date.date() === rule.ruleVal[1])
        check = true
    }
    else if(rule.ruleType === 'rule-2'){ // 매달 n일
      if(date.date() === rule.ruleVal[0])
        check = true
    }
    else if(rule.ruleType === 'rule-3'){ // 매달 마지막 날
      if(date.date() === date.endOf('month').date())
        return true 
    }
    else if(rule.ruleType === 'rule-4'){ // 매주 *요일
      const val_ary = rule.ruleVal.map((val, i)=>{
        if(val > 0) return i
      }).filter(e=>e!==undefined)
      if(val_ary.indexOf(date.day()) > -1) return true
    }
    else if(rule.ruleType === 'rule-5'){ // 매일
      return true
    }
    else if(rule.ruleType === 'rule-6'){ // n일 간격으로
      const rule_start = my_dayjs(`${rule.ruleVal[0]}-${rule.ruleVal[1]}-${rule.ruleVal[2]}`)
      const diff = date.diff(rule_start, 'day')
      if(diff >= 0) {
        if(diff % rule.ruleVal[3] === 0) return true
      }
    }

    if(check) {
      if(rule.operation === 2) { // plus
        value += rule.value
      }
      else if(rule.operation === 3) { // minus
        value -= rule.value
      }
      else value = rule.value // reset
    }
  })
  return value
}

const calculate = (
  date: Dayjs,
  final_oper_obj: {
    [key:string] : { value: number, oper: number }
  },
  rulesInfo: CalendarRulesInfo
) => {
  let value = 0; // 값 (초기화 되는 날짜 기준)
  let state = 0;
  const f_oper = rulesInfo.final_operation.operation
  const f_value = rulesInfo.final_operation.value
  
  if(f_oper !== 1) {
    const curr_date_str = date.format('YYYY-MM-DD')
    const curr_date = my_dayjs(curr_date_str)
    const curr_date_val = curr_date.valueOf()
    const keys = Object.keys(final_oper_obj).sort((a, b)=>{
      return a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: 'base'
      })
    })
    
    const final_oper_ary = keys.map(key=>{
      if(final_oper_obj[key].oper === 1) return { info: final_oper_obj[key], key: key }
    }).filter(e=>e!==undefined)

    const reset_rules = rulesInfo.rules.filter(r=>r.operation < 2)

    let recent_reset = my_dayjs('1001-01-01')
    const date_check = (date_ary: (Dayjs|string)[], recent_reset: Dayjs) => {
      date_ary.forEach(element=>{
        const day = typeof(element) === 'string' ? my_dayjs(element) : element
        if(recent_reset.valueOf() < day.valueOf() &&
          day.valueOf() <= curr_date_val
        ) {
          recent_reset = day
        }
      })
      return recent_reset
    }

    final_oper_ary.forEach(element=>{
      recent_reset = date_check([element.key], recent_reset)
    })
    const start = curr_date.startOf('month')
    const end = curr_date.endOf('month')
    reset_rules.forEach(rule=>{
      let date_ary = []
      if(rule.ruleType === 'rule-1') {
        const tmp = start.set('month', rule.ruleVal[0]-1).set('date', rule.ruleVal[1])
        date_ary = [ tmp, tmp.subtract(1, 'year') ]
      }
      else if(rule.ruleType === 'rule-2') {
        const tmp = start.set('date', rule.ruleVal[0])
        date_ary = [ tmp, tmp.subtract(1, 'month') ]
      }
      else if(rule.ruleType === 'rule-3') {
        date_ary = [ end, end.subtract(1, 'month') ]
      }
      else if(rule.ruleType === 'rule-4') {
        const val_ary = rule.ruleVal.map((val, i)=>{
          if(val > 0) return i
        }).filter(e=>e!==undefined)
        for(let i=0;i<7;i+=1) {
          const tmp = curr_date.subtract(i, 'day')
          if(val_ary.indexOf(tmp.get('day')) > -1) {
            date_ary.push(tmp)
          }
        }
      }
      else if(rule.ruleType === 'rule-5') {
        date_ary = [ curr_date ]
      }
      else if(rule.ruleType === 'rule-6') {
        const rule_start = my_dayjs(`${rule.ruleVal[0]}-${rule.ruleVal[1]}-${rule.ruleVal[2]}`)
        const diff = Math.abs(rule_start.diff(curr_date, 'day'))
        date_ary = [ curr_date.subtract(diff % rule.ruleVal[3], 'day') ]
      }
      recent_reset = date_check(date_ary, recent_reset)
    })

    if(recent_reset.valueOf() === my_dayjs('1001-01-01').valueOf()) {
      value = undefined
    }
    else {
      const rules = lodash.cloneDeep(rulesInfo.rules).reverse()
      value = get_reset_value(recent_reset, rules)
      keys.forEach(key=>{
        if(my_dayjs(key).valueOf() === recent_reset.valueOf()) {
          const oper = final_oper_obj[key]?.oper
          const val = final_oper_obj[key]?.value
          if(oper !== undefined && val !== undefined) {
            if(oper === 2) value += val
            else if(oper === 3) value -= val
            else value = val
          }
        }
      })
      
      keys.forEach(key=>{
        if(final_oper_obj[key].oper !== 1) {
          const info = final_oper_obj[key]
          const val = my_dayjs(key).valueOf()
          if(recent_reset.valueOf() < val && val < date.valueOf()) {
            if(info.oper === 2) value += info.value
            else if(info.oper === 3) value -= info.value
          }
        }
      })

      rules.forEach(rule=>{
        const diff_val = curr_date.diff(recent_reset, 'day')
        let iter = -1
        if(rule.ruleType === 'rule-1') { // 매년 n월 n일
          const tmp = recent_reset.format('YYYY-MM-DD').split('-').map(v=>parseInt(v))
          const curr = curr_date.add(1, 'day').format('YYYY-MM-DD').split('-').map(v=>parseInt(v))
          iter = (curr[0] - tmp[0])
          if(recent_reset.valueOf() <= recent_reset.set('month', rule.ruleVal[0]-1).set('date', rule.ruleVal[1]).valueOf()) {
            iter += 1
          }
          if(curr_date_val <= curr_date.set('month', rule.ruleVal[0]-1).set('date', rule.ruleVal[1]).valueOf()) {
            iter -= 1
          }
          iter = Math.max(iter-1, 0)
        }
        else if(rule.ruleType === 'rule-2') { // 매달 n일
          const tmp = recent_reset.format('YYYY-MM-DD').split('-').map(v=>parseInt(v))
          const curr = curr_date.add(1, 'day').format('YYYY-MM-DD').split('-').map(v=>parseInt(v))
          iter = (curr[0] - tmp[0]) * 12 + (curr[1] - tmp[1])
          if(tmp[2] > rule.ruleVal[0]) {
            iter -= 1
          }
          if(curr[2] > rule.ruleVal[0]) {
            iter += 1
          }
          iter = Math.max(iter-1, 0)
        }
        else if(rule.ruleType === 'rule-3') { // 매달 마지막 날
          const tmp = recent_reset.format('YYYY-MM').split('-').map(v=>parseInt(v))
          const curr = curr_date.add(1, 'day').format('YYYY-MM-DD').split('-').slice(0, 2).map(v=>parseInt(v))
          iter = (curr[0] - tmp[0]) * 12 + (curr[1] - tmp[1])
          iter = Math.max(iter-1, 0)
        }
        else if(rule.ruleType === 'rule-4') { // 매주 *요일
          const val_ary = rule.ruleVal.map((val, i)=>{
            if(val > 0) return i
          }).filter(e=>e!==undefined)
          iter = Math.floor(diff_val / 7) * val_ary.length
          for(let j=1; j<=(diff_val%7); j+=1) {
            const tmp = recent_reset.add(j, 'day')
            if(val_ary.indexOf(tmp.day()) > -1) iter += 1
          }
        }
        else if(rule.ruleType === 'rule-5') { // 매일
          iter = diff_val
        }
        else if(rule.ruleType === 'rule-6') { // n일 간격으로
          const rule_start = my_dayjs(`${rule.ruleVal[0]}-${rule.ruleVal[1]}-${rule.ruleVal[2]}`)
          let diff = curr_date.diff(rule_start, 'day')
          const tmp = recent_reset.diff(rule_start, 'day')
          if(diff >= 0) {
            if(rule.ruleVal[3] !== undefined && rule.ruleVal[3] > 0) {
              iter = Math.floor(diff/rule.ruleVal[3])
              if(recent_reset.valueOf() >= rule_start.valueOf()) {
                iter -= Math.floor(tmp/rule.ruleVal[3])
              }
            }
          }
        }
        if(iter >= 0) {
          if(rule.operation === 2) { // plus
            value += rule.value * iter
          }
          else if(rule.operation === 3) { // minus
            value -= rule.value * iter
          }
          // else if(diff_val === 0) value = rule.value // reset
        }
      })
      if(f_oper === 2) value += f_value
      else if(f_oper === 3) value -= f_value
    }
  }
  else { // reset
    value = f_value
    state = 1
  }

  return {
    value : value,
    state : state
  }
}

export const calculate_var = (
  dataset: CalendarItemDatasetWithDateISOString[],
  final_oper_data: {
    uuid: string,
    final_oper : { [key:string] : { value: number, oper: number } }
  }[],
) => {
  for(let i=0;i<dataset.length;i+=1) {
    const data = dataset[i]
    for(let j=0;j<data.info.ary.length;j+=1) {
      const info = data.info.ary[j]
      const final_oper_ary = final_oper_data.find(data=>data.uuid === info.uuid)
      const { value, state } = calculate(data.date, final_oper_ary?final_oper_ary.final_oper:{}, info)
      dataset[i].info.ary[j].value = value
      dataset[i].info.ary[j].state = state
      if(i > 0 && state !== 1) {
        const prev_val = dataset[i-1].info.ary[j].value
        if(prev_val !== undefined && value !== undefined) {
          if(value > prev_val) dataset[i].info.ary[j].state = 2
          else if(value < prev_val) dataset[i].info.ary[j].state = 3
        }
      }
    }
  }
  return dataset.slice(1)
}