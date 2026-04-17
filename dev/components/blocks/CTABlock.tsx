type CTABlockProps = {
  heading?: string | null
  text?: string | null
  buttonLabel?: string | null
  buttonUrl?: string | null
}

export const CTABlock = ({ heading, text, buttonLabel, buttonUrl }: CTABlockProps) => {
  if (!heading && !text && !buttonLabel) {
    return null
  }

  return (
    <section className="rounded-xl border border-border bg-secondary/40 p-6 shadow-sm sm:p-8">
      {heading ? <h2 className="font-heading text-2xl font-semibold tracking-tight">{heading}</h2> : null}
      {text ? <p className="mt-3 text-base leading-7 text-muted-foreground">{text}</p> : null}
      {buttonLabel && buttonUrl ? (
        <p className="mt-5">
          <a
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            href={buttonUrl}
          >
            {buttonLabel}
          </a>
        </p>
      ) : buttonLabel ? (
        <p className="mt-5 text-sm font-medium text-foreground">{buttonLabel}</p>
      ) : null}
    </section>
  )
}
