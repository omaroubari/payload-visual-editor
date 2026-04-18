import { Button } from 'dev/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from 'dev/components/ui/toggle-group'
import { cn } from 'dev/lib/utils'
import { Bold, Calendar1, Ellipsis, Italic, Strikethrough, Underline } from 'lucide-react'

type ContentItem = {
  description?: string | null
  illustration?: 'code' | 'schedule' | null
  title?: string | null
}

export type ContentBlockProps = {
  description?: string | null
  eyebrow?: string | null
  heading?: string | null
  items?: ContentItem[] | null
}

const ScheduleIllustration = ({ className }: { className?: string }) => {
  return (
    <div className={cn('relative', className)}>
      <div className="bg-background -translate-x-1/8 absolute flex -translate-y-[110%] items-center gap-2 rounded-lg p-1 shadow-lg shadow-black/10">
        <Button className="rounded-sm" size="sm">
          <Calendar1 className="size-3" />
          <span className="text-sm font-medium">Schedule</span>
        </Button>
        <span className="bg-border block h-4 w-px" />
        <ToggleGroup className="gap-0.5 *:rounded-md" size="sm">
          <ToggleGroupItem aria-label="Toggle bold" value="bold">
            <Bold className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Toggle italic" value="italic">
            <Italic className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Toggle underline" value="underline">
            <Underline className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Toggle strikethrough" value="strikethrough">
            <Strikethrough className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <span className="bg-border block h-4 w-px" />
        <Button className="size-8" size="icon" variant="ghost">
          <Ellipsis className="size-3" />
        </Button>
      </div>
      <span>
        <span className="bg-secondary text-secondary-foreground py-1">Tomorrow 8:30 pm</span> is our
        priority.
      </span>
    </div>
  )
}

const CodeIllustration = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        '[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_50%,transparent_100%)]',
        className,
      )}
    >
      <ul className="text-muted-foreground mx-auto w-fit font-mono text-2xl font-medium">
        {['Images', 'Variables', 'Pages', 'Components', 'Styles'].map((item, index) => (
          <li
            className={cn(
              index === 2 &&
                "text-foreground before:absolute before:-translate-x-[110%] before:text-orange-500 before:content-['Import']",
            )}
            key={item}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export const ContentBlock = ({ description, eyebrow, heading, items }: ContentBlockProps) => {
  if (!heading || !items?.length) {
    return null
  }

  return (
    <section>
      <div className="bg-muted/50 py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div>
            {eyebrow ? <span className="text-primary">{eyebrow}</span> : null}
            <h2 className="text-foreground mt-4 text-4xl font-semibold">{heading}</h2>
            {description ? (
              <p className="text-muted-foreground mb-12 mt-4 text-lg">{description}</p>
            ) : null}
          </div>

          <div className="border-foreground/5 space-y-6 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)] sm:space-y-0 sm:divide-y">
            {items.map((item, index) => {
              const Illustration =
                item.illustration === 'schedule' ? ScheduleIllustration : CodeIllustration

              return (
                <div className="grid sm:grid-cols-5" key={`${item.title ?? 'item'}-${index}`}>
                  <div
                    className={cn(
                      'flex items-center justify-center sm:col-span-2',
                      index % 2 === 1 && 'pt-12',
                    )}
                  >
                    <Illustration className={cn(index % 2 === 1 && 'pt-8')} />
                  </div>

                  <div
                    className={cn(
                      'mt-6 sm:col-span-3 sm:mt-0 sm:border-l sm:pl-12',
                      index % 2 === 1 && 'sm:pt-12',
                    )}
                  >
                    {item.title ? (
                      <h3 className="text-foreground text-xl font-semibold">{item.title}</h3>
                    ) : null}
                    {item.description ? (
                      <p className="text-muted-foreground mt-4 text-lg">{item.description}</p>
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
