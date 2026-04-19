import type { Page } from '@/payload-types'

import { HighImpactHero } from '@/heros/HighImpact'
import React from 'react'
export type HeroData = {
  _sourceMap?:
    | {
        [k: string]: unknown
      }
    | boolean
    | null
    | number
    | string
    | unknown[]
} & Page['hero']

const heroes = {
  highImpact: HighImpactHero,
}

export const RenderHero: React.FC<HeroData> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') {
    return null
  }

  const HeroToRender = heroes[type]

  if (!HeroToRender) {
    return null
  }

  return <HeroToRender {...props} />
}
