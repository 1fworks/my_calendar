import React from 'react'
import type { AppProps } from 'next/app'

import { Logo } from '@/components/my_logo'
import { Provider } from '@/components/ui/provider'
import { ColorModeButton } from '@/components/ui/color-mode'

import '../styles/globals.css'

import { useMediaQuery } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'

function MyApp({ Component, pageProps }: AppProps) {
  const oh_no = useMediaQuery(['(min-width: 250px)', '(min-height:300px)']).indexOf(false)>-1

  return (
    <Provider>
      { oh_no && <Logo/> }
      <div className={oh_no?'hidden':''}>
        <ColorModeButton className='mx-2 my-2' />
        <Button className='my-2 rounded-sm mobile:rounded-full'>hi</Button>
        <Component {...pageProps} />
      </div>
    </Provider>
  )
}

export default MyApp
