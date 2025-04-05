import { Dayjs } from "dayjs"
import { useState } from "react"

export const Item = ({
	isCurrMonth,
	date,
}:{
	isCurrMonth:boolean,
	date:Dayjs
}) => {
  const [ selected, setSelected ] = useState(false)
	return (
		<div className={`calendar-item ${isCurrMonth?'font-bold':'opacity-50'}`}>
      <button className="calendar-circle">
        <div>
          {date.format('D')}
        </div>
      </button>
		</div>
	)
}