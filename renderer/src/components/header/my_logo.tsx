import { useTheme } from "next-themes"

export const Logo = () => {
  const { theme } = useTheme()
  return (
    <div className='w-dvw h-dvh p-2'>
      <svg className={`mx-auto max-w-40 size-full ${theme==='dark'?'fill-white':'fill-black'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
        <path d="M 6 0 L 0 6 L 1 7 L 7 1 L 6 0 M 2 8 L 6 12 L 12 6 L 11 5 L 10 6 L 7 3 L 6 4 L 9 7 L 8 8 L 5 5 Z"/>
      </svg>
    </div>
  )
}