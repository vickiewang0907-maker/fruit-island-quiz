import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 水果狗血劇 — Fruit Island',
  description: '測測你是 Fruit Island 裡的哪種抓馬角色？',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}
