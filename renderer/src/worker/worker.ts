import { CalendarItemDatasetWithDateISOString } from "@/components/calendar/interface";
import { calculate_var } from "@/lib/calculationVar";
import my_dayjs from "@/lib/mydayjs";
import { Rules } from "@/lib/savload/load_file";

onmessage = async (e) => {
  if(e.data.type !== 'start') {
    postMessage([])
    return;
  }

  const result: CalendarItemDatasetWithDateISOString[] = e.data.result.map(element => {
    element.date = my_dayjs(element.date_string)
    return element
  })
  const rulesInfos: Rules[] = e.data.rulesInfos
  
  const items_data: CalendarItemDatasetWithDateISOString[] = calculate_var(result, rulesInfos?rulesInfos.map(r=>{
    return ({ uuid: r.uuid, final_oper: r.final_oper })
  }):[]).map(item => {
    item.date_string = item.date.toISOString()
    return item
  })

  postMessage({
    type: 'items_data',
    items: items_data,
    verCounter: e.data.verCounter,
  })
}