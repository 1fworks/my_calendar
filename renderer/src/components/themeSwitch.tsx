import { useTheme } from "next-themes"
import { RiMoonClearLine } from "react-icons/ri";
import { ImSun } from "react-icons/im";
import { useEffect, useState } from "react";

export const ThemeSwitch = () => {
	const { theme, setTheme } = useTheme()
	const [ mounted, setMounted ] = useState<boolean>(false)

	useEffect(()=>{
		if(!mounted) setMounted(true)
	}, [mounted])
	
	if(!mounted) return null
	
	return (
		<button
			className="m-2 absolute top-0 left-0 theme-switch"
			onClick={()=>{
				if(theme === 'dark') setTheme('light')
				else setTheme('dark')
			}}
		>
			{ theme === 'dark' && <RiMoonClearLine /> }
			{ theme !== 'dark' && <ImSun /> }
		</button>
	)
}