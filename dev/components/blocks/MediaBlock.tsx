type MediaValue =
  | string
  | {
      url?: string | null
    }
  | null

type MediaBlockProps = {
  caption?: string | null
  media?: MediaValue
}

const getImageURL = (media?: MediaValue) => {
  if (!media || typeof media === 'string') {
    return null
  }

  return media.url ?? null
}

export const MediaBlock = ({ caption, media }: MediaBlockProps) => {
  const imageURL = getImageURL(media)

  if (!imageURL && !caption) {
    return null
  }

  return (
    <section className="py-12">
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="bg-background rounded-(--radius) overflow-hidden border border-transparent shadow-lg shadow-black/10 ring-1 ring-black/10">
          {imageURL ? (
            <img className="h-auto w-full object-cover" src={imageURL} alt={caption ?? 'Media'} />
          ) : (
            <div className="bg-muted/60 flex aspect-[16/10] items-center justify-center px-6 text-center">
              <p className="text-muted-foreground text-sm">Image unavailable</p>
            </div>
          )}
        </div>

        {caption ? <p className="text-muted-foreground mt-4 text-sm">{caption}</p> : null}
      </div>
    </section>
  )
}
