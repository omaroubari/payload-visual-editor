import { CMSButtonLink, type CMSLinkData } from './CMSButtonLink.js'

export type CTABlockProps = {
  description?: string | null
  heading?: string | null
  links?: Array<{
    id?: string | null
    link?: CMSLinkData | null
  }> | null
}

export const CTABlock = ({ description, heading, links }: CTABlockProps) => {
  if (!heading && !description && !links?.length) {
    return null
  }

  return (
    <section>
      <div className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="space-y-6 text-center">
            {heading ? (
              <h2 className="text-foreground text-balance text-3xl font-semibold lg:text-4xl">
                {heading}
              </h2>
            ) : null}

            {description ? (
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">{description}</p>
            ) : null}

            {links?.length ? (
              <div className="flex flex-wrap justify-center gap-3">
                {links.map(({ link }, index) => (
                  <CMSButtonLink key={index} link={link} size="lg" />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
