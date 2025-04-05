import React from 'react'
import type { AppProps } from 'next/app'

import { ThemeProvider } from 'next-themes'
import localFont from 'next/font/local'

import '../styles/globals.css'
import style from '../styles/main.module.scss'
import { Header } from '@/components/header/header'
import { useMediaQuery } from 'usehooks-ts'
import { Logo } from '@/components/header/my_logo'

const pretendard = localFont({
  src: '../public/font/PretendardVariable.woff2',
  display: 'block',
  weight: '45 920',
  style: 'normal',
  variable: '--pretendard-font'
})

function MyApp({ Component, pageProps }: AppProps) {
  const check = [useMediaQuery('(max-width:250px)'), useMediaQuery('(max-height:250px)')]
  return (
    <div className={`${style.mytheme} ${pretendard.variable}`}>
      <ThemeProvider>
        { check.indexOf(true)>-1?
          <>
            <Logo/>
          </>
        :
          <>
            <Header/>
            <Component {...pageProps} />
          </>
        }
      </ThemeProvider>
    </div>
  )
}

export default MyApp
