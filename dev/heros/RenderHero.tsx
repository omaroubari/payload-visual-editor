import { HighImpactHero } from '@/heros/HighImpact'
import React from 'react'

import type { HeroData } from './types'

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
