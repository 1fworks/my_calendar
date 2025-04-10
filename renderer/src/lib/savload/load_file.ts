import { Dayjs } from "dayjs"
import { getMemofileName, getSavfileName } from "./save_file"

export interface Rules {
  alias: string;
  final_oper: {
      value: number;
      oper: number;
  };
  rules: {
      ruleType: string;
      ruleVal: number[];
      value: number;
      oper: number;
  }[];
}

export interface Memo {
  content: string;
  favorite: boolean;
}

export const load_rules = async(
  savfileSlot:number,
) => {
  const data: undefined|Rules[] = await window.ipc.loadFile(getSavfileName(savfileSlot))
  return data
}

export const load_memo = async(
  savfileSlot:number,
  date:Dayjs,
)=>{
  const data: undefined|Memo = await window.ipc.loadFile(getMemofileName(savfileSlot, date))
  return data
}