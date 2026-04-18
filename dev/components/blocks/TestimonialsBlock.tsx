import { Avatar, AvatarFallback, AvatarImage } from 'dev/components/ui/avatar'
import { cn } from 'dev/lib/utils'
import { Star } from 'lucide-react'

type TestimonialItem = {
  avatarUrl?: string | null
  content?: string | null
  name?: string | null
  role?: string | null
  stars?: '1' | '2' | '3' | '4' | '5' | null
}

export type TestimonialsBlockProps = {
  description?: string | null
  heading?: string | null
  items?: TestimonialItem[] | null
}

export const TestimonialsBlock = ({ description, heading, items }: TestimonialsBlockProps) => {
  if (!items?.length) {
    return null
  }

  return (
    <section>
      <div className="py-24">
        <div className="@container mx-auto w-full max-w-5xl px-6">
          {heading || description ? (
            <div className="mb-12 max-w-2xl">
              {heading ? (
                <h2 className="text-foreground text-balance text-4xl font-semibold">{heading}</h2>
              ) : null}
              {description ? (
                <p className="text-muted-foreground mt-4 text-lg">{description}</p>
              ) : null}
            </div>
          ) : null}

          <div className="@lg:grid-cols-2 @3xl:grid-cols-3 @3xl:gap-12 grid gap-6">
            {items.map((testimonial, index) => {
              const stars = Number(testimonial.stars ?? '5')
              const name = testimonial.name?.trim() || 'Anonymous'

              return (
                <div key={`${name}-${index}`}>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        className={cn(
                          'size-4',
                          starIndex < stars
                            ? 'fill-primary stroke-primary'
                            : 'fill-foreground/15 stroke-transparent',
                        )}
                        key={starIndex}
                      />
                    ))}
                  </div>

                  {testimonial.content ? (
                    <p className="text-foreground my-4">{testimonial.content}</p>
                  ) : null}

                  <div className="flex items-center gap-2">
                    <Avatar className="ring-foreground/10 size-6 border border-transparent shadow ring-1">
                      <AvatarImage alt={name} src={testimonial.avatarUrl ?? undefined} />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-foreground text-sm font-medium">{name}</div>
                    {testimonial.role ? (
                      <>
                        <span aria-hidden className="bg-foreground/25 size-1 rounded-full" />
                        <span className="text-muted-foreground text-sm">{testimonial.role}</span>
                      </>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
