'use client'

import { CMSLink } from '@/components/CMSLink'
import { HeroHeader } from 'dev/components/header'
import { Sparkle } from 'lucide-react'
import { createEditableAttrs } from 'payload-visual-editor'
import React from 'react'

import type { HeroData } from '../RenderHero'

const getImageURL = (media?: HeroData['media']) => {
  if (!media || typeof media !== 'object') {
    return null
  }

  return media.url ?? null
}

export const HighImpactHero: React.FC<HeroData> = ({
  _sourceMap,
  announcement,
  heading,
  links,
  media,
  subheading,
}) => {
  if (!heading) {
    return null
  }

  const imageURL = getImageURL(media)

  const editable = createEditableAttrs(_sourceMap as Record<string, string> | undefined)

  return (
    <>
      <HeroHeader />
      <section className="before:bg-muted border-e-foreground relative overflow-hidden before:absolute before:inset-1 before:h-[calc(100%-8rem)] before:rounded-2xl sm:before:inset-2 md:before:rounded-[2rem] lg:before:h-[calc(100%-14rem)]">
        <div className="py-20 md:py-36">
          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
            <div>
              {announcement ? (
                <div className="hover:bg-foreground/5 mx-auto flex w-fit items-center justify-center gap-2 rounded-md py-0.5 pl-1 pr-3 transition-colors duration-150">
                  <div
                    aria-hidden
                    className="border-background bg-linear-to-b dark:inset-shadow-2xs to-foreground from-primary relative flex size-5 items-center justify-center rounded border shadow-md shadow-black/20 ring-1 ring-black/10"
                  >
                    <div className="absolute inset-x-0 inset-y-1.5 border-y border-dotted border-white/25" />
                    <div className="absolute inset-x-1.5 inset-y-0 border-x border-dotted border-white/25" />
                    <Sparkle className="size-3 fill-white stroke-white drop-shadow" />
                  </div>
                  <span className="font-medium">{announcement}</span>
                </div>
              ) : null}

              <h1
                {...editable('hero.heading')}
                className="mx-auto mt-8 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl"
              >
                {heading}
              </h1>

              {subheading ? (
                <p
                  {...editable('hero.subheading')}
                  className="text-muted-foreground mx-auto my-6 max-w-xl text-balance text-xl"
                >
                  {subheading}
                </p>
              ) : null}

              {links?.length ? (
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {links.map(({ link }, index) => (
                    <CMSLink key={index} {...link} size="lg" />
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 mx-auto max-w-5xl px-6">
              <div className="mt-12 md:mt-16">
                <div className="bg-background rounded-(--radius) relative mx-auto overflow-hidden border border-transparent shadow-lg shadow-black/10 ring-1 ring-black/10">
                  {imageURL ? (
                    <img alt={heading} className="h-auto w-full object-cover" src={imageURL} />
                  ) : (
                    <div className="bg-muted/60 flex aspect-[16/10] items-center justify-center">
                      <div className="bg-background/80 rounded-2xl border border-black/5 p-8 shadow-lg shadow-black/5">
                        <p className="text-muted-foreground text-sm uppercase tracking-[0.3em]">
                          Live Preview
                        </p>
                        <p className="mt-3 text-2xl font-semibold">Add hero media in Payload</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
