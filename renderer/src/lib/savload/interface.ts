import { CalendarRule } from "@/components/calendar/interface";

export interface aliasWithRule {
  alias: string,
  rules: CalendarRule[],
  final_operation: {
    value: number,
    operation: number,
  }[]
}

export interface calendarJSON {
  memo: {
    [date: string]: {
      content: string,
      favorite: boolean,
    }
  },
  ary: aliasWithRule[],
}