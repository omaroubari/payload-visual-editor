import { IconHelp } from '../icons/index.js'
import { Tooltip } from '../ui/tooltip/index.js'
import styles from './styles.module.scss'

interface HelpTooltipProps {
  content: string
}

export const HelpTooltip = ({ content }: HelpTooltipProps) => {
  return (
    <Tooltip className={styles.tooltip} content={content}>
      <IconHelp className={styles.tooltipIcon} />
    </Tooltip>
  )
}
