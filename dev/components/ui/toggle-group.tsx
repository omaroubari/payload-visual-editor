'use client'

import { ToggleGroup as ToggleGroupPrimitive, Toggle as TogglePrimitive } from '@base-ui/react'
import { type VariantProps } from 'class-variance-authority'
import { toggleVariants } from 'dev/components/ui/toggle'
import { cn } from 'dev/lib/utils'
import * as React from 'react'

const ToggleGroupContext = React.createContext<
  {
    orientation?: 'horizontal' | 'vertical'
    spacing?: number
  } & VariantProps<typeof toggleVariants>
>({
  orientation: 'horizontal',
  size: 'default',
  spacing: 0,
  variant: 'default',
})

function ToggleGroup({
  children,
  className,
  orientation = 'horizontal',
  size,
  spacing = 0,
  variant,
  ...props
}: {
  orientation?: 'horizontal' | 'vertical'
  spacing?: number
} & ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive
      className={cn(
        'group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] data-[spacing=0]:data-[variant=outline]:rounded-4xl data-vertical:flex-col data-vertical:items-stretch',
        className,
      )}
      data-orientation={orientation}
      data-size={size}
      data-slot="toggle-group"
      data-spacing={spacing}
      data-variant={variant}
      style={{ '--gap': spacing } as React.CSSProperties}
      {...props}
    >
      <ToggleGroupContext value={{ orientation, size, spacing, variant }}>
        {children}
      </ToggleGroupContext>
    </ToggleGroupPrimitive>
  )
}

function ToggleGroupItem({
  children,
  className,
  size = 'default',
  variant = 'default',
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  const context = React.use(ToggleGroupContext)

  return (
    <TogglePrimitive
      className={cn(
        'shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-3 group-data-[spacing=0]/toggle-group:shadow-none focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-2.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-2.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-3xl group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-3xl group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-3xl group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-3xl data-[state=on]:bg-muted group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t',
        toggleVariants({
          size: context.size || size,
          variant: context.variant || variant,
        }),
        className,
      )}
      data-size={context.size || size}
      data-slot="toggle-group-item"
      data-spacing={context.spacing}
      data-variant={context.variant || variant}
      {...props}
    >
      {children}
    </TogglePrimitive>
  )
}

export { ToggleGroup, ToggleGroupItem }
