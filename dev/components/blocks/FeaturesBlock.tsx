import { Button } from 'dev/components/ui/button'
import { Card } from 'dev/components/ui/card'
import { cn } from 'dev/lib/utils'
import {
  ArrowUp,
  CalendarCheck,
  Globe,
  Play,
  Plus,
  Signature,
  Sparkles,
  Target,
} from 'lucide-react'

const iconMap = {
  calendarCheck: CalendarCheck,
  sparkles: Sparkles,
  target: Target,
}

type FeatureItem = {
  description?: string | null
  icon?: keyof typeof iconMap | null
  illustration?: 'assistant' | 'codeReview' | 'meeting' | null
  title?: string | null
}

export type FeaturesBlockProps = {
  description?: string | null
  features?: FeatureItem[] | null
  heading?: string | null
}

const AVATARS = [
  { alt: 'Meschac Irung', src: 'https://avatars.githubusercontent.com/u/47919550?v=4' },
  { alt: 'Bernard Ngandu', src: 'https://avatars.githubusercontent.com/u/31113941?v=4' },
  { alt: 'Theo Balick', src: 'https://avatars.githubusercontent.com/u/68236786?v=4' },
  { alt: 'Glodie Lukose', src: 'https://avatars.githubusercontent.com/u/99137927?v=4' },
]

const MeetingIllustration = () => {
  return (
    <Card aria-hidden className="mt-9 aspect-video p-4">
      <div className="mb-0.5 text-sm font-semibold">AI Strategy Meeting</div>
      <div className="mb-4 flex gap-2 text-sm">
        <span className="text-muted-foreground">2:30 - 3:45 PM</span>
      </div>
      <div className="mb-2 flex -space-x-1.5">
        <div className="flex -space-x-1.5">
          {AVATARS.map((avatar) => (
            <div
              className="bg-background size-7 rounded-full border p-0.5 shadow shadow-zinc-950/5"
              key={avatar.src}
            >
              <img
                alt={avatar.alt}
                className="aspect-square rounded-full object-cover"
                height="460"
                src={avatar.src}
                width="460"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="text-muted-foreground text-sm font-medium">ML Pipeline Discussion</div>
    </Card>
  )
}

const CodeReviewIllustration = () => {
  return (
    <div aria-hidden className="relative mt-6">
      <Card className="aspect-video w-4/5 translate-y-4 p-3 transition-transform duration-200 ease-in-out group-hover:-rotate-3">
        <div className="mb-3 flex items-center gap-2">
          <div className="bg-background size-6 rounded-full border p-0.5 shadow shadow-zinc-950/5">
            <img
              alt="Meschac Irung"
              className="aspect-square rounded-full object-cover"
              height="460"
              src={AVATARS[0]?.src}
              width="460"
            />
          </div>
          <span className="text-muted-foreground text-sm font-medium">Meschac Irung</span>
          <span className="text-muted-foreground/75 text-xs">2m</span>
        </div>

        <div className="ml-8 space-y-2">
          <div className="bg-foreground/10 h-2 rounded-full" />
          <div className="bg-foreground/10 h-2 w-3/5 rounded-full" />
          <div className="bg-foreground/10 h-2 w-1/2 rounded-full" />
        </div>

        <Signature className="ml-8 mt-3 size-5" />
      </Card>
      <Card className="aspect-3/5 absolute -top-4 right-0 flex w-2/5 translate-y-4 p-2 transition-transform duration-200 ease-in-out group-hover:rotate-3">
        <div className="bg-foreground/5 m-auto flex size-10 rounded-full">
          <Play className="fill-foreground/50 stroke-foreground/50 m-auto size-4" />
        </div>
      </Card>
    </div>
  )
}

const AssistantIllustration = () => {
  return (
    <Card
      aria-hidden
      className="mt-6 aspect-video translate-y-4 p-4 pb-6 transition-transform duration-200 group-hover:translate-y-0"
    >
      <div className="w-fit">
        <Sparkles className="size-3.5 fill-purple-300 stroke-purple-300" />
        <p className="mt-2 line-clamp-2 text-sm">
          How can I optimize my neural network to reduce inference time while maintaining accuracy?
        </p>
      </div>
      <div className="bg-foreground/5 -mx-3 -mb-3 mt-3 space-y-3 rounded-lg p-3">
        <div className="text-muted-foreground text-sm">Ask AI Assistant</div>

        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button
              className="size-7 rounded-2xl bg-transparent shadow-none"
              size="icon"
              variant="outline"
            >
              <Plus />
            </Button>
            <Button
              className="size-7 rounded-2xl bg-transparent shadow-none"
              size="icon"
              variant="outline"
            >
              <Globe />
            </Button>
          </div>

          <Button className="size-7 rounded-2xl bg-black" size="icon">
            <ArrowUp strokeWidth={3} />
          </Button>
        </div>
      </div>
    </Card>
  )
}

const renderIllustration = (illustration?: FeatureItem['illustration']) => {
  if (illustration === 'meeting') return <MeetingIllustration />
  if (illustration === 'codeReview') return <CodeReviewIllustration />
  return <AssistantIllustration />
}

export const FeaturesBlock = ({ description, features, heading }: FeaturesBlockProps) => {
  if (!heading || !features?.length) {
    return null
  }

  return (
    <section>
      <div className="py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="max-w-3xl">
            <h2 className="text-foreground text-balance text-4xl font-semibold">{heading}</h2>
            {description ? (
              <p className="text-muted-foreground mt-4 max-w-2xl text-lg">{description}</p>
            ) : null}
          </div>

          <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon ?? 'sparkles'] ?? Sparkles

              return (
                <Card
                  className={cn(
                    'group overflow-hidden px-6 pt-6',
                    feature.illustration === 'meeting' && 'p-6',
                  )}
                  key={`${feature.title ?? 'feature'}-${index}`}
                  variant="soft"
                >
                  <Icon className="text-primary size-5" />
                  {feature.title ? (
                    <h3 className="text-foreground mt-5 text-lg font-semibold">{feature.title}</h3>
                  ) : null}
                  {feature.description ? (
                    <p className="text-muted-foreground mt-3 text-balance">{feature.description}</p>
                  ) : null}
                  {renderIllustration(feature.illustration)}
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
