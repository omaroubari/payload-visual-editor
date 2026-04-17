import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'dev/lib/utils'
import * as React from 'react'

const cardVariants = cva('text-card-foreground rounded-xl', {
  defaultVariants: {
    variant: 'default',
  },
  variants: {
    variant: {
      default: 'bg-card border shadow border-transparent ring-1 ring-foreground/5',
      mixed: 'bg-foreground/5 border border-foreground.5',
      soft: 'bg-foreground/5',
    },
  },
})

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = ({
  className,
  ref,
  variant,
  ...props
}: { ref?: React.RefObject<HTMLDivElement | null> } & CardProps) => (
  <div className={cn(cardVariants({ className, variant }))} ref={ref} {...props} />
)
Card.displayName = 'Card'

const CardHeader = ({
  className,
  ref,
  ...props
}: { ref?: React.RefObject<HTMLDivElement | null> } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} ref={ref} {...props} />
)
CardHeader.displayName = 'CardHeader'

const CardTitle = ({
  className,
  ref,
  ...props
}: { ref?: React.RefObject<HTMLDivElement | null> } & React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('font-semibold leading-none tracking-tight', className)}
    ref={ref}
    {...props}
  />
)
CardTitle.displayName = 'CardTitle'

const CardDescription = ({
  className,
  ref,
  ...props
}: { ref?: React.RefObject<HTMLDivElement | null> } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('text-muted-foreground text-sm', className)} ref={ref} {...props} />
)
CardDescription.displayName = 'CardDescription'

const CardContent = ({
  className,
  ref,
  ...props
}: { ref?: React.RefObject<HTMLDivElement | null> } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-6 pt-0', className)} ref={ref} {...props} />
)
CardContent.displayName = 'CardContent'

const CardFooter = ({
  className,
  ref,
  ...props
}: { ref?: React.RefObject<HTMLDivElement | null> } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center p-6 pt-0', className)} ref={ref} {...props} />
)
CardFooter.displayName = 'CardFooter'

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
