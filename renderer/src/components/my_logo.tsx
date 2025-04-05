import { useColorModeValue } from '@/components/ui/color-mode'

export const Logo = () => {
  const svg_color = useColorModeValue("fill-black", "fill-white")
  return (
    <div className='w-dvw h-dvh grid grid-flow-row p-5 py-28'>
      <svg className={`size-full mx-auto ${svg_color}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
        <path d="M 6 0 L 0 6 L 1 7 L 7 1 L 6 0 M 2 8 L 6 12 L 12 6 L 11 5 L 10 6 L 7 3 L 6 4 L 9 7 L 8 8 L 5 5 Z"/>
      </svg>
    </div>
  )
}