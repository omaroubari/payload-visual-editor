import { useId } from 'react'

import { HelpTooltip } from '../../../help-tooltip/index.js'
import { Checkbox } from '../../../ui/checkbox/index.js'
import styles from './styles.module.scss'

interface CheckboxFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  checked?: boolean
  label: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  tooltip?: string
}

export const CheckboxField = ({
  checked,
  className = '',
  label,
  onChange,
  tooltip,
  ...props
}: CheckboxFieldProps) => {
  const id = useId()

  return (
    <div className={`${styles.container} ${className}`} {...props}>
      <Checkbox checked={checked} id={id} onChange={onChange} />
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {tooltip && <HelpTooltip content={tooltip} />}
    </div>
  )
}
