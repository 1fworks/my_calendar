import { CalendarRulesInfo } from "@/components/calendar/interface";
import { Dayjs } from "dayjs";
import lodash from 'lodash';
import { load_rules, Rules } from "./load_file";

export const getSavfileName = (savfileSlot:number) => {
  return `./savfiles/sav-${savfileSlot}.json`
}

export const getMemofileName = (savfileSlot:number, date:Dayjs) => {
  return `./savfiles/memos/${savfileSlot}/memo-${date.format('YYYY-MM-DD')}.json`
}

export const save_memo = async(
  savfileSlot:number,
  date:Dayjs,
  memoContent:string,
  favorite:boolean
) => {
  if(memoContent.length > 0) {
    await window.ipc.saveFile(getMemofileName(savfileSlot, date),
    {
      content: memoContent,
      favorite: favorite,
    })
  }
  else window.ipc.rmFile(getMemofileName(savfileSlot, date))
}

export const save_file = async(
  savfileSlot:number,
  date:Dayjs,
  memoContent:string,
  favorite:boolean,
  rulesInfo: CalendarRulesInfo[]
) => {

  const rulesInfoData = await load_rules(savfileSlot)

  const data: Rules[] = rulesInfo.map((info, i)=>{
    const idx = rulesInfoData.map(data=>data.uuid).indexOf(info.uuid)
    const new_oper = idx > -1 ? rulesInfoData[idx].final_oper : {}
    const key = date.format('YYYY-MM-DD')
    if(info.final_operation.operation > 0) {
      new_oper[key] = {
        value: info.final_operation.value,
        oper: info.final_operation.operation
      }
    }
    else delete new_oper[key]

    return (
      {
        uuid: info.uuid,
        alias: info.alias,
        final_oper: new_oper,
        rules: info.rules.map(rule=>{
          return {
            uuid: rule.uuid,
            ruleType: rule.ruleType,
            ruleVal: rule.ruleVal,
            value: rule.value,
            oper: rule.operation,
          }
        })
      }
    )
  })
  await window.ipc.saveFile(getSavfileName(savfileSlot), data)
  await save_memo(savfileSlot, date, memoContent, favorite)
}

export const heart_toggle = async(savfileSlot:number, date:Dayjs) => {
  const data = await window.ipc.loadFile(getMemofileName(savfileSlot, date))
  if(data) {
    if(typeof(data.favorite)==='boolean') {
      await save_memo(savfileSlot, date, data.content?data.content:'', !data.favorite)
    }
  }
}