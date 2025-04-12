import { useState, useEffect } from "react"
import my_dayjs from "@/lib/mydayjs"

export const CurrTime = () => {
	const [ time, setTime ] = useState(my_dayjs('1111-1-1'))
	useEffect(() => {
		if(time.valueOf() === my_dayjs('1111-1-1').valueOf()) {
			setTime(my_dayjs())
		}
		const timer = setInterval(() => {
			setTime(my_dayjs())
		}, 1000);
		return () => clearInterval(timer);
	}, []);
	
	return (
		<div className="current-time flex flex-col">
			<span>{time.format('LL')}</span>
			<span>{time.format('LTS')}</span>
		</div>
	)
}