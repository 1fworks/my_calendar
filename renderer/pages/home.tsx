import React, { useState } from 'react'
import Head from 'next/head'
import { Canlendar } from '@/components/calendar/calendar'
// import Link from 'next/link'
// <Link href="/next">Go to next page</Link>

export default function HomePage() {
  const [ active, setActive ] = useState(false)
  return (
    <React.Fragment>
      <Head>
        <title>Amazing - Calendar</title>
      </Head>
      <div
        className={`overlay ${active?'overlay-active':''}`}
        onClick={()=>setActive(false)}
      />
      <Canlendar/>
    </React.Fragment>
  )
}
