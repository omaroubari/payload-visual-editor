type MediaValue =
  | string
  | {
      url?: string | null
    }
  | null

type MediaBlockProps = {
  image?: MediaValue
  caption?: string | null
}

const getImageURL = (image?: MediaValue) => {
  if (!image || typeof image === 'string') {
    return null
  }

  return image.url ?? null
}

export const MediaBlock = ({ image, caption }: MediaBlockProps) => {
  const imageURL = getImageURL(image)

  if (!imageURL && !caption) {
    return null
  }

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
      {imageURL ? (
        <img className="h-auto w-full rounded-lg object-cover" src={imageURL} alt={caption ?? 'Media'} />
      ) : (
        <p className="rounded-lg border border-dashed border-border bg-muted px-4 py-12 text-center text-sm text-muted-foreground">
          Image unavailable
        </p>
      )}
      {caption ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{caption}</p> : null}
    </section>
  )
}
