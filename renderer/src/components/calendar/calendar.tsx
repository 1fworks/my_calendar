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
import { load_memo, load_rules } from "@/lib/savload/load_file";
import { calculate_var } from "@/lib/calculationVar";

export const Canlendar = () => {
	const [ time, setTime ] = useState(my_dayjs('1111-1-1'))
	const [ date, setDate ] = useState('')
	const [ items, setItems ] = useState<CalendarItemDataset[]>([])
	const [ detailTrigger, setDetailTrigger ] = useState<string>('')

	const [ savfileSlot, setSavefileSlot ] = useState<number>(1)

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
		// =============================================================
		const rulesInfos = await load_rules(savfileSlot)
		const info_ary = rulesInfos ? rulesInfos.map(element=>{
			const rulesInfo = lodash.cloneDeep(element)
			if(!rulesInfo) return undefined
			return (
				{
					uuid: (rulesInfo?.uuid) ? (rulesInfo?.uuid) : uuidv4(),
					alias: (rulesInfo?.alias) ? (rulesInfo?.alias) : '변수',
					value: 0, // :)
					state: 0, // :D
					final_operation: (rulesInfo?.final_oper) ? (rulesInfo?.final_oper) : {},
					rules: ((rulesInfo?.rules)===undefined ? [] : rulesInfo.rules).map(rule=>{
						return (
							{
								uuid: (rule?.uuid) ? (rule?.uuid) : uuidv4(),
								ruleType: (rule?.ruleType) ? (rule?.ruleType) : 'rule-1',
								ruleVal: (rule?.ruleVal && Array.isArray(rule.ruleVal) && rule.ruleVal.length > 6) ? lodash.cloneDeep(rule.ruleVal) : [1, 1, 1, 1, 1, 1, 1],
								value: (rule?.value) ? (rule?.value) : 0,
								operation: (rule?.oper) ? (rule?.oper) : 1,
							}
						)
					})
				}
			)
		}).filter(element=>element!==undefined)
		:[]
		// =============================================================
		
		const ary = [item_data_ary[0]-1, ...item_data_ary]
		for( const [i, val] of ary.entries() ){
			let isCurrMonth = true
			let date = time
			if(val < 0) {
				isCurrMonth = false
				if(i < 7 + 1) { // if(i < 7)
					date = time.startOf('month').subtract(Math.abs(val), 'days')
				}
				else {
					date = time.endOf('month').add(Math.abs(val), 'days')
				}
			}
			else date = time.startOf('month').add(val-1, 'days')
			
			// =============================================================
			let memo = await load_memo(savfileSlot, date)
			if(memo === undefined) memo = { content: '', favorite: true }
			memo = {
				content: memo.content?memo.content:'',
				favorite: typeof(memo.favorite)==='boolean'?memo.favorite:true,
			}

			const ary = lodash.cloneDeep(info_ary).map((element)=>{
				const f_oper = element.final_operation[date.format('YYYY-MM-DD')]
				return {
					...element,
					final_operation : f_oper ? {
						value: (f_oper?.value) ? (f_oper?.value) : 0,
						operation: (f_oper?.oper) ? (f_oper?.oper) : 0,
					} : {
						value: 0,
						operation: 0,
					},
				}
			})
			// =============================================================
			
			result.push({
				val: val,
				isCurrMonth: isCurrMonth,
				date: date,
				info: {
					memo: memo.content,
					favorite: memo.favorite,
					ary: ary,
				}
			})
		}
		setItems(calculate_var(result, rulesInfos.map(r=>{
			return ({ uuid: r.uuid, final_oper: r.final_oper })
		})))
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
	}, [time, savfileSlot]);

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

	// const setItem = (i:number, item: CalendarItemDataset) => {
	// 	const newItems:CalendarItemDataset[] = lodash.cloneDeep(items)
	// 	if(newItems.length > i) {
	// 		newItems[i] = item
	// 		setItems(newItems)
	// 	}
	// }

	const header = [1, 2, 3, 4, 5, 6, 7].map(val=>{
		return my_dayjs(`2024-12-${val}`).format('ddd')
	})
	const check = date.split('-').length > 0 && parseInt(date.split('-')[0]) >= 1900

	return (
		<>
			<div className="calendar">
				<div className="p-2 absolute top-0 left-0 flex flex-row gap-2">
					<NoteBook
						items={check?items:[]}
						savfileSlot={savfileSlot}
						setDetailTrigger={setDetailTrigger}
						resetCalendarData={resetCalendarData}
						date={date}
						prevPage={prevPage}
						nextPage={nextPage}
					/>
					<ThemeSwitch />
				</div>
				<CurrTime />
				<div>
					<div className="current-data grid grid-flow-col items-center pt-1">
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
				{ check &&
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
							{ items.map((item)=>{
									return (
										<div key={`item-${item.date.format('YYYY-MM-DD')}`} className="w-full h-full grid items-center">
											<Item
												savfileSlot={savfileSlot}
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