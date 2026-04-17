import { Avatar, AvatarFallback, AvatarImage } from 'dev/components/ui/avatar'
import { cn } from 'dev/lib/utils'
import { Star } from 'lucide-react'

export default function TestimonialSection() {
  const testimonials = [
    {
      name: 'Méschac Irung',
      avatar: 'https://avatars.githubusercontent.com/u/47919550?v=4',
      content:
        "Using Tailark has been like unlocking a secret design superpower. It's the perfect fusion of simplicity.",
      role: 'Creator',
      stars: 5,
    },
    {
      name: 'Théo Balick',
      avatar: 'https://avatars.githubusercontent.com/u/68236786?v=4',
      content:
        'Tailark has transformed the way I develop web applications. The flexibility to customize every aspect is amazing.',
      role: 'Frontend Dev',
      stars: 4,
    },
    {
      name: 'Glodie Lukose',
      avatar: 'https://avatars.githubusercontent.com/u/99137927?v=4',
      content:
        'The extensive collection of UI components has significantly accelerated my workflow.',
      role: 'Frontend Dev',
      stars: 5,
    },
  ]

  return (
    <section>
      <div className="py-24">
        <div className="@container mx-auto w-full max-w-5xl px-6">
          <div className="@lg:grid-cols-2 @3xl:grid-cols-3 @3xl:gap-12 grid gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index}>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      className={cn(
                        'size-4',
                        i < testimonial.stars
                          ? 'fill-primary stroke-primary'
                          : 'fill-foreground/15 stroke-transparent',
                      )}
                      key={i}
                    />
                  ))}
                </div>
                <p className="text-foreground my-4">{testimonial.content}</p>
                <div className="flex items-center gap-2">
                  <Avatar className="ring-foreground/10 size-6 border border-transparent shadow ring-1">
                    <AvatarImage alt={testimonial.name} src={testimonial.avatar} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-foreground text-sm font-medium">{testimonial.name}</div>
                  <span aria-hidden className="bg-foreground/25 size-1 rounded-full"></span>
                  <span className="text-muted-foreground text-sm">{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
