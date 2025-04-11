import { CalendarItemDataset, CalendarRulesInfo } from "@/components/calendar/interface";
import { Dayjs } from "dayjs";
import my_dayjs from "./mydayjs";

const calculate = (
  date: Dayjs,
  final_oper_obj: {
    [key:string] : { value: number, oper: number }
  },
  rulesInfo: CalendarRulesInfo
) => {
  let value = 0;
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
        const tmp = start.set('month', rule.ruleVal[0]).set('date', rule.ruleVal[1])
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
        [ curr_date ]
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
      rulesInfo.rules.forEach(rule=>{
        let iter = 0
        if(rule.ruleType === 'rule-1') { // 매년 n월 n일
          
        }
        else if(rule.ruleType === 'rule-2') { // 매달 n일
          
        }
        else if(rule.ruleType === 'rule-3') { // 매달 마지막 날
          
        }
        else if(rule.ruleType === 'rule-4') { // 매주 *요일
          
        }
        else if(rule.ruleType === 'rule-5') { // 매일
          iter = Math.abs(recent_reset.diff(curr_date, 'day'))
        }
        else if(rule.ruleType === 'rule-6') { // n일 간격으로
          
        }
        if(rule.operation === 2) { // plus
          value += rule.value * iter
        }
        else if(rule.operation === 3) { // minus
          value -= rule.value * iter
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
  dataset: CalendarItemDataset[],
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