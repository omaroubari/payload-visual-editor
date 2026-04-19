import type { MediaSectionBlock as MediaSectionBlockType } from "@/payload-types"


const getImageURL = (media?: MediaSectionBlockType['media']) => {
  if (!media || typeof media === 'string') {
    return null
  }

  return media.url ?? null
}

export const MediaBlock = ({ caption, media }: MediaSectionBlockType) => {
  const imageURL = getImageURL(media)

  if (!imageURL && !caption) {
    return null
  }

  return (
    <section className="py-12">
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="bg-background rounded-(--radius) overflow-hidden border border-transparent shadow-lg shadow-black/10 ring-1 ring-black/10">
          {imageURL ? (
            <img alt={caption ?? 'Media'} className="h-auto w-full object-cover" src={imageURL} />
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
