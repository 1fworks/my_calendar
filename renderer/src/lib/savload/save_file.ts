import { CalendarRulesInfo } from "@/components/calendar/interface"
import { Dayjs } from "dayjs"

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
}

export const save_file = async(
  savfileSlot:number,
  date:Dayjs,
  memoContent:string,
  favorite:boolean,
  rulesInfo: CalendarRulesInfo[]
) => {

  const data = rulesInfo.map(info=>{
    return (
      {
        alias: info.alias,
        final_oper: {
          value: info.final_operation.value,
          oper: info.final_operation.operation,
        },
        rules: info.rules.map(rule=>{
          return {
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