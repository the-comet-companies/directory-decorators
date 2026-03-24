'use client'

import dynamic from 'next/dynamic'

const NearMeClient = dynamic(() => import('./NearMeClient'), { ssr: false })

export default function NearMeWrapper() {
  return <NearMeClient />
}
