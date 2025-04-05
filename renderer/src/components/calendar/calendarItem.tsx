import { Dayjs } from "dayjs"

export const Item = ({
	isCurrMonth,
	date,
}:{
	isCurrMonth:boolean,
	date:Dayjs
}) => {
	return (
		<div className={`calendar-item ${isCurrMonth?'font-bold':'opacity-50'}`}>
			{date.format('D')}
		</div>
	)
}