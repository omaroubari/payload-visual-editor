type ContentBlockProps = {
  heading?: string | null
  content?: string | null
}

export const ContentBlock = ({ heading, content }: ContentBlockProps) => {
  if (!heading && !content) {
    return null
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
      {heading ? <h2 className="font-heading text-2xl font-semibold tracking-tight">{heading}</h2> : null}
      {content ? <p className="mt-3 text-base leading-7 text-muted-foreground">{content}</p> : null}
    </section>
  )
}
