import { useState, useEffect } from "react"
import { ThemeSwitch } from "./themeSwitch"
import my_dayjs from "../../../lib/mydayjs"

export const Header = () => {
  const [ time, setTime ] = useState(my_dayjs())
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(my_dayjs())
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <ThemeSwitch/>
      <div className="w-fit mx-auto my-5 font-bold">{time.format('LL LTS')}</div>
    </div>
  )
}