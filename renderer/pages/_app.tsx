import React from 'react'
import type { AppProps } from 'next/app'
import { Provider } from '@/components/ui/provider'
import { ColorModeButton } from '@/components/ui/color-mode'

import '../styles/globals.css'
import { Button } from '@chakra-ui/react'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <ColorModeButton className='mx-2 my-2'/>
      <Button className='my-2 rounded-full'>hi</Button>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
