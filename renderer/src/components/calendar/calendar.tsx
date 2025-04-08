import { useState, useEffect } from "react"
import my_dayjs from "@/lib/mydayjs"
import { Item } from './calendarItem'
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { CurrTime } from "./currTime";
import { ThemeSwitch } from "../themeSwitch";
import { NoteBook } from "../notebook";
import { Dayjs } from "dayjs";

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

export const Canlendar = () => {
	const [ time, setTime ] = useState(my_dayjs('1111-1-1'))
	const [ date, setDate ] = useState('')
	const [ items, setItems ] = useState<CalendarItemDataset[]>([])

	useEffect(() => {
		if(time.valueOf() === my_dayjs('1111-1-1').valueOf()) {
			const now = my_dayjs()
			setTime(now)
			setDate(now.format('YYYY-MM'))
		}
		else {
			const start = time.startOf('month').day() // 0 (Sunday) to 6 (Saturday)
			const last = time.endOf('month').date() // 1 ~ 31

			const item_data_ary:number[] = []
			for(let i=-start+1;i<=last;i+=1){
				if(i<=0) item_data_ary.push(i-1)
				else item_data_ary.push(i)
			}
			const count = 7*6 - item_data_ary.length
			for(let i=0;i<count;i+=1){
				item_data_ary.push(-(i+1))
			}

			const setCanlendarData = async() => {
				setItems(item_data_ary.map((val, i)=>{
					let isCurrMonth = true
					let date = time
					if(val < 0) {
						isCurrMonth = false
						if(i < 7) {
							date = time.startOf('month').subtract(Math.abs(val), 'days')
						}
						else {
							date = time.endOf('month').add(Math.abs(val), 'days')
						}
					}
					else date = time.startOf('month').add(val-1, 'days')
					return {
						val: val,
						isCurrMonth: isCurrMonth,
						date: date,
						info: {
							memo: 'test memo',
							favorite: true,
							ary: [
								{ alias: 'alias 1', value: 100, state: 0, final_operation: { value: 0, operation: 0 }, rules: [] },
								{ alias: 'alias 2', value: 100, state: 1, final_operation: { value: 10, operation: 1 }, rules: [] },
								{ alias: 'alias 3', value: 100, state: 2, final_operation: { value: 20, operation: 2 }, rules: [] },
								{ alias: 'alias 4', value: 100, state: 3, final_operation: { value: 30, operation: 3 }, rules: [
										{ rule: 'rule-1', value: [1, 1, 1, 1, 1, 1, 1], operation: 0 },
										{ rule: 'rule-2', value: [1, 1, 1, 1, 1, 1, 1], operation: 1 },
										{ rule: 'rule-3', value: [1, 1, 1, 1, 1, 1, 1], operation: 2 },
										{ rule: 'rule-4', value: [1, 1, 1, 1, 1, 1, 1], operation: 0 },
										{ rule: 'rule-5', value: [1, 1, 1, 1, 1, 1, 1], operation: 1 },
										{ rule: 'rule-6', value: [1, 1, 1, 1, 1, 1, 1], operation: 2 },
									]
								},
							],
						},
					}
				}))
			}
			setCanlendarData()
		}
	}, [time]);

	const nextPage = () => {
		const t = time.add(1, 'month')
    setTime(t)
		setDate(t.format('YYYY-MM'))
  }

  const prevPage = () => {
		const t = time.subtract(1, 'month')
		setTime(t)
		setDate(t.format('YYYY-MM'))
  }

	const header = [1, 2, 3, 4, 5, 6, 7].map(val=>{
		return my_dayjs(`2024-12-${val}`).format('ddd')
	})

	return (
		<>
			<div className="calendar">
				<div className="p-2 absolute top-0 left-0 flex flex-row gap-2">
					<NoteBook items={items}/>
					<ThemeSwitch />
				</div>
				<CurrTime />
				<div>
					<div className="current-data grid grid-flow-col items-center">
						<button className="mr-2 p-2" onClick={prevPage}><BsChevronLeft /></button>
						<div className="w-fit flex flex-row gap-1">
              <input
								className="year-month div-border font-bold"
								value={date}
								type="month"
								onChange={(e)=>{
									setDate(e.target.value)
									if(e.target.value.length !== 0) {
										const tmp = e.target.value.split('-')
										setTime(my_dayjs().year(
											Math.min(Math.max(parseInt(tmp[0]), 1900), 9999)
										).month(
											Math.min(Math.max(parseInt(tmp[1])-1, 0), 11)
										))
									}
								}}
							/>
						</div>
						<button className="ml-2 p-2" onClick={nextPage}><BsChevronRight /></button>
					</div>
				</div>
				{ date.split('-').length > 0 && parseInt(date.split('-')[0]) >= 1900 &&
					<>
						<div className='calendar-grid pt-5'>
							{ header.map((val, i)=>{
									return (
										<div
											key={`day-${val}`}
											className={`calendar-day ${(i===0||i===6)?'font-bold opacity-80':'opacity-70'}`}
										>
											{val}
										</div>
									)
								})
							}
						</div>
						<div className='calendar-grid h-full'>
							{ items.map((item, i)=>{
									return (
										<div key={`item-${i}`} className="w-full h-full grid items-center">
											<Item itemDetail={item}/>
										</div>
									)
								})
							}
						</div>
					</>
				}
			</div>
		</>
	)
}