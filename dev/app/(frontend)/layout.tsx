import type { ReactNode } from 'react'

import { Geist } from 'next/font/google'

import './styles.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

type Props = {
  children: ReactNode
}

export default function FrontendLayout({ children }: Props) {
  return (
    <html className={geist.className} lang="en">
      <body>{children}</body>
    </html>
  )
}
