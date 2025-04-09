import { Dayjs } from "dayjs"

export interface CalendarRule {
  uuid: string,
  ruleType: string,
  ruleVal: number[],
  value: number,
  operation: number, // x, reset, plus, minus
}

export interface CalendarRulesInfo {
  uuid: string,
  alias: string,
  value: number,
  state: number, // normal update plus minus
  final_operation: {
    value: number,
    operation: number, // nothing, reset, plus, minus
  },
  rules: CalendarRule[],
}

export interface CalendarItemInfo {
  memo: string,
  favorite: boolean,
  ary: CalendarRulesInfo[],
}

export interface CalendarItemDataset {
  val: number,
  isCurrMonth: boolean,
  date: Dayjs,
  info: CalendarItemInfo
}