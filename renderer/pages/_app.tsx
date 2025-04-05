import React, { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'

import { ThemeProvider } from 'next-themes'
import localFont from 'next/font/local'
import { useMediaQuery } from 'usehooks-ts'

import '../styles/globals.css'
import style from '../styles/main.module.scss'
import { ThemeSwitch } from "@/components/themeSwitch"
import { Logo } from '@/components/my_logo'

const pretendard = localFont({
  src: '../public/font/PretendardVariable.woff2',
  display: 'block',
  weight: '45 920',
  style: 'normal',
  variable: '--pretendard-font'
})

function MyApp({ Component, pageProps }: AppProps) {
  const check = [useMediaQuery('(max-width:250px)'), useMediaQuery('(max-height:320px)')]
  const [ mount, setMount ] = useState(false)
  useEffect(()=>{
    if(!mount) setMount(true)
  }, [mount])
  if(!mount) return null

  return (
    <div className={`${style.mytheme} ${pretendard.variable}`}>
      <ThemeProvider>
        <div className={`${check.indexOf(true)>-1?'':'hidden'}`}>
          <Logo/>
        </div>
        <div className={`${check.indexOf(true)>-1?'hidden':''}`}>
          <ThemeSwitch/>
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </div>
  )
}

export default MyApp
