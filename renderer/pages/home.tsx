import React from 'react'
import Head from 'next/head'
import { Canlendar } from '@/components/calendar/calendar'
// import Link from 'next/link'
// <Link href="/next">Go to next page</Link>

export default function HomePage() {
  return (
    <React.Fragment>
      <Head>
        <title>Amazing - Calendar</title>
      </Head>
      
      <Canlendar/>
    </React.Fragment>
  )
}
