import React from 'react'
import type { AppProps } from 'next/app'
import { Provider } from '@/components/ui/provider'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
