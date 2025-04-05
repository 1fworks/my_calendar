import { useState, useEffect } from "react"
import my_dayjs from "@/lib/mydayjs"
import { Item } from './calendarItem'
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { CurrTime } from "./currTime";

export const Canlendar = () => {
	const [ time, setTime ] = useState(my_dayjs('1111-1-1'))

	useEffect(() => {
		if(time.valueOf() === my_dayjs('1111-1-1').valueOf()) {
			setTime(my_dayjs())
		}
	}, []);

	const nextPage = () => {
    setTime(time.add(1, 'month'))
  }

  const prevPage = () => {
    setTime(time.subtract(1, 'month'))
  }

	const header = [1, 2, 3, 4, 5, 6, 7].map(val=>{
		return my_dayjs(`2024-12-${val}`).format('ddd')
	})
	
	const start = time.startOf('month').day() // 0 (Sunday) to 6 (Saturday)
	const last = time.endOf('month').date() // 1 ~ 31

	const items = []
	for(let i=-start+1;i<=last;i+=1){
		if(i<=0) items.push(i-1)
		else items.push(i)
	}
	const count = 7*6 - items.length
	for(let i=0;i<count;i+=1){
		items.push(-(i+1))
	}

	return (
		<div className="calendar">
			<CurrTime />
			<div>
				<div className="current-data grid grid-flow-col items-center">
					<button className="mr-3 p-2" onClick={prevPage}><BsChevronLeft /></button>
					<div className="w-fit">
						<div className="current-day">{time.format('YYYY MMM')}</div>
					</div>
					<button className="ml-3 p-2" onClick={nextPage}><BsChevronRight /></button>
				</div>
			</div>

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
				{ items.map((val, i)=>{
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
					return (
						<div key={`item-${i}`} className="w-full h-full grid items-center">
							<Item isCurrMonth={isCurrMonth} date={date}/>
						</div>
					)
				}) }
			</div>
		</div>
	)
}