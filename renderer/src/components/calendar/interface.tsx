import { Dayjs } from "dayjs"

export interface CalendarRule {
  rule: string,
  value: number[],
  operation: number,
}

export interface CalendarRulesInfo {
  alias: string,
  value: number,
  state: number, // normal update plus minus
  final_operation: {
    value: number,
    operation: number,
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