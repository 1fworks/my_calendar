import { useState, useEffect } from "react"
import my_dayjs from "@/lib/mydayjs"
import { Item } from './calendarItem'
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { CurrTime } from "./currTime";
import { ThemeSwitch } from "../themeSwitch";
import { NoteBook } from "./notebook";
import { CalendarItemDataset } from './interface';
import lodash from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export const Canlendar = () => {
	const [ time, setTime ] = useState(my_dayjs('1111-1-1'))
	const [ date, setDate ] = useState('')
	const [ items, setItems ] = useState<CalendarItemDataset[]>([])
	const [ detailTrigger, setDetailTrigger ] = useState<string>('')

	const resetCalendarData = async() => {
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

		const result: CalendarItemDataset[] = []
		item_data_ary.forEach((val, i)=>{
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
			result.push({
				val: val,
				isCurrMonth: isCurrMonth,
				date: date,
				info: {
					memo: i%3==0?'test memo':'',
					favorite: i%2==0?true:false,
					ary: [
						// { uuid: uuidv4(), alias: 'alias 1', value: 100, state: 0, final_operation: { value: 0, operation: 0 }, rules: [] },
						// { uuid: uuidv4(), alias: 'alias 2', value: 100, state: 1, final_operation: { value: 10, operation: 1 }, rules: [] },
						// { uuid: uuidv4(), alias: 'alias 3', value: 100, state: 2, final_operation: { value: 20, operation: 2 }, rules: [] },
						// { uuid: uuidv4(), alias: 'alias 4', value: 100, state: 3, final_operation: { value: 30, operation: 3 }, rules: [
						// 		{ uuid: uuidv4(), ruleType: 'rule-1', ruleVal: [1, 1, 1, 1, 1, 1, 1], value: 0, operation: 1 },
						// 		{ uuid: uuidv4(), ruleType: 'rule-2', ruleVal: [1, 1, 1, 1, 1, 1, 1], value: 0, operation: 1 },
						// 		{ uuid: uuidv4(), ruleType: 'rule-3', ruleVal: [1, 1, 1, 1, 1, 1, 1], value: 0, operation: 2 },
						// 		{ uuid: uuidv4(), ruleType: 'rule-4', ruleVal: [1, 1, 1, 1, 1, 1, 1], value: 0, operation: 3 },
						// 		{ uuid: uuidv4(), ruleType: 'rule-5', ruleVal: [1, 1, 1, 1, 1, 1, 1], value: 0, operation: 1 },
						// 		{ uuid: uuidv4(), ruleType: 'rule-6', ruleVal: [1, 1, 1, 1, 1, 1, 1], value: 0, operation: 2 },
						// 	]
						// },
					],
				},
			})
		})
		setItems(result)
	}

	useEffect(() => {
		if(time.valueOf() === my_dayjs('1111-1-1').valueOf()) {
			const now = my_dayjs()
			setTime(now)
			setDate(now.format('YYYY-MM'))
		}
		else {
			resetCalendarData()
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

	const setItem = (i:number, item: CalendarItemDataset) => {
		const newItems:CalendarItemDataset[] = lodash.cloneDeep(items)
		if(newItems.length > i) {
			newItems[i] = item
			setItems(newItems)
		}
	}

	const header = [1, 2, 3, 4, 5, 6, 7].map(val=>{
		return my_dayjs(`2024-12-${val}`).format('ddd')
	})

	return (
		<>
			<div className="calendar">
				<div className="p-2 absolute top-0 left-0 flex flex-row gap-2">
					<NoteBook items={items} setDetailTrigger={setDetailTrigger} resetCalendarData={resetCalendarData} />
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
											<Item
												itemDetail={item}
												resetCalendar={resetCalendarData}
												// setItem={(item:CalendarItemDataset)=>{setItem(i, item)}}
												detailTrigger={
													{
														val: detailTrigger,
														reset: ()=>{ setDetailTrigger('') }
													}
												}
											/>
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