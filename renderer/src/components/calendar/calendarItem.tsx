import { Dayjs } from "dayjs"
import { useState } from "react"

export const Item = ({
	isCurrMonth,
	date,
}:{
	isCurrMonth:boolean,
	date:Dayjs,
}) => {
  const [ active, setActive ] = useState(false)

  const closeDetail = () => {
    setActive(false)
  }

  const showDetail = () => {
    if(!active) {
      setActive(true)
    }
  }

	return (
    <>
      <div
        className={`overlay ${active?'overlay-active':''}`}
        onClick={closeDetail}
      />
      <div className={`calendar-item ${isCurrMonth?'font-bold':'opacity-50'}`}>
        <button className="calendar-circle" onClick={showDetail}>
          <div>
            {date.format('D')}
          </div>
        </button>
      </div>
    </>
	)
}