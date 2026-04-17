type MediaValue =
  | string
  | {
      url?: string | null
    }
  | null

type HeroType = 'none' | 'highImpact' | 'mediumImpact' | 'lowImpact'

type HeroBlockProps = {
  type?: HeroType | null
  heading?: string | null
  subheading?: string | null
  primaryButtonLabel?: string | null
  primaryButtonUrl?: string | null
  secondaryButtonLabel?: string | null
  secondaryButtonUrl?: string | null
  media?: MediaValue
}

const getImageURL = (media?: MediaValue) => {
  if (!media || typeof media === 'string') {
    return null
  }

  return media.url ?? null
}

const HeroButtons = ({
  primaryButtonLabel,
  primaryButtonUrl,
  secondaryButtonLabel,
  secondaryButtonUrl,
}: Pick<
  HeroBlockProps,
  'primaryButtonLabel' | 'primaryButtonUrl' | 'secondaryButtonLabel' | 'secondaryButtonUrl'
>) => {
  if (!primaryButtonLabel && !secondaryButtonLabel) {
    return null
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      {primaryButtonLabel && primaryButtonUrl ? (
        <a
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          href={primaryButtonUrl}
        >
          {primaryButtonLabel}
        </a>
      ) : null}
      {secondaryButtonLabel && secondaryButtonUrl ? (
        <a
          className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          href={secondaryButtonUrl}
        >
          {secondaryButtonLabel}
        </a>
      ) : null}
    </div>
  )
}

export const HeroBlock = ({
  type = 'lowImpact',
  heading,
  subheading,
  primaryButtonLabel,
  primaryButtonUrl,
  secondaryButtonLabel,
  secondaryButtonUrl,
  media,
}: HeroBlockProps) => {
  if (type === 'none' || !heading) {
    return null
  }

  const imageURL = getImageURL(media)

  if (type === 'highImpact') {
    return (
      <section className="relative isolate overflow-hidden bg-slate-950 py-24 text-white sm:py-32">
        {imageURL ? (
          <img src={imageURL} alt={heading} className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45" />
        ) : null}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/45 to-black/75" />
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{heading}</h2>
            {subheading ? <p className="mt-5 max-w-2xl text-lg text-white/85">{subheading}</p> : null}
            <HeroButtons
              primaryButtonLabel={primaryButtonLabel}
              primaryButtonUrl={primaryButtonUrl}
              secondaryButtonLabel={secondaryButtonLabel}
              secondaryButtonUrl={secondaryButtonUrl}
            />
          </div>
        </div>
      </section>
    )
  }

  if (type === 'mediumImpact') {
    return (
      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading ? <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{subheading}</p> : null}
          <HeroButtons
            primaryButtonLabel={primaryButtonLabel}
            primaryButtonUrl={primaryButtonUrl}
            secondaryButtonLabel={secondaryButtonLabel}
            secondaryButtonUrl={secondaryButtonUrl}
          />
          {imageURL ? (
            <img src={imageURL} alt={heading} className="mt-8 h-auto w-full rounded-xl border border-border object-cover" />
          ) : null}
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-border bg-card p-8 sm:p-10">
        <h2 className="text-balance text-3xl font-semibold tracking-tight">{heading}</h2>
        {subheading ? <p className="mt-4 text-base leading-7 text-muted-foreground">{subheading}</p> : null}
        <HeroButtons
          primaryButtonLabel={primaryButtonLabel}
          primaryButtonUrl={primaryButtonUrl}
          secondaryButtonLabel={secondaryButtonLabel}
          secondaryButtonUrl={secondaryButtonUrl}
        />
      </div>
    </section>
  )
}
