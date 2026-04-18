import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'dev/components/ui/accordion'

import { CMSInlineLink, type CMSLinkData } from './CMSButtonLink.js'

type FAQItem = {
  answer?: string | null
  question?: string | null
}

export type FAQsBlockProps = {
  description?: string | null
  heading?: string | null
  items?: FAQItem[] | null
  supportLink?: CMSLinkData | null
  supportText?: string | null
}

export const FAQsBlock = ({
  description,
  heading,
  items,
  supportLink,
  supportText,
}: FAQsBlockProps) => {
  if (!heading || !items?.length) {
    return null
  }

  return (
    <section className="bg-muted py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div>
          <h2 className="text-foreground text-4xl font-semibold">{heading}</h2>
          {description ? (
            <p className="text-muted-foreground mt-4 text-balance text-lg">{description}</p>
          ) : null}
        </div>

        <div className="mt-12">
          <Accordion className="bg-card ring-foreground/5 rounded-(--radius) w-full border border-transparent px-8 py-3 shadow ring-1">
            {items.map((item, index) => {
              if (!item.question) return null

              return (
                <AccordionItem
                  className="border-dotted"
                  key={`${item.question}-${index}`}
                  value={`item-${index + 1}`}
                >
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>

          {supportText || supportLink ? (
            <p className="text-muted-foreground mt-6">
              {supportText}
              {supportText && supportLink ? ' ' : null}
              <CMSInlineLink
                className="text-primary font-medium hover:underline"
                link={supportLink}
              />
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
