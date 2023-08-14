import './globals.css'
import { IBM_Plex_Sans } from 'next/font/google'

const ibm = IBM_Plex_Sans({ subsets: ['latin'], weight: '500' })

export const metadata = {
  title: 'Sajad Mahyaei',
  description: 'Let\'s make something great.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={ibm.className}>{children}</body>
    </html>
  )
}
