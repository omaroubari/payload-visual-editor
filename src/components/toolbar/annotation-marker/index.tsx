import type { Annotation } from '../../../types.js'

import { IconEdit, IconPlus, IconXmark } from '../../icons/index.js'
import styles from './styles.module.scss'

type MarkerClickBehavior = 'delete' | 'edit'

// =============================================================================
// AnnotationMarker
// =============================================================================

type AnnotationMarkerProps = {
  annotation: Annotation
  globalIndex: number
  isAnimated: boolean
  isClearing: boolean
  isDeleting: boolean
  isEditingAny: boolean
  isExiting: boolean
  isHovered: boolean
  /** Display index within this layer (for staggered animation delays) */
  layerIndex: number
  layerSize: number
  markerClickBehavior: MarkerClickBehavior
  onClick: (annotation: Annotation) => void
  onContextMenu?: (annotation: Annotation) => void
  onHoverEnter: (annotation: Annotation) => void
  onHoverLeave: () => void
  renumberFrom: null | number
  tooltipStyle?: React.CSSProperties
}

export function AnnotationMarker({
  annotation,
  globalIndex,
  isAnimated,
  isClearing,
  isDeleting,
  isEditingAny,
  isExiting,
  isHovered,
  layerIndex,
  layerSize,
  markerClickBehavior,
  onClick,
  onContextMenu,
  onHoverEnter,
  onHoverLeave,
  renumberFrom,
  tooltipStyle,
}: AnnotationMarkerProps) {
  const showDeleteState = (isHovered || isDeleting) && !isEditingAny
  const showDeleteHover = showDeleteState && markerClickBehavior === 'delete'
  const isMulti = annotation.isMultiSelect

  const markerColor = isMulti ? 'var(--agentation-color-green)' : 'var(--agentation-color-accent)'

  const animClass = isExiting
    ? styles.exit
    : isClearing
      ? styles.clearing
      : !isAnimated
        ? styles.enter
        : ''

  const animationDelay = isExiting
    ? `${(layerSize - 1 - layerIndex) * 20}ms`
    : `${layerIndex * 20}ms`

  return (
    <div
      className={`${styles.marker} ${isMulti ? styles.multiSelect : ''} ${animClass} ${showDeleteHover ? styles.hovered : ''}`}
      data-annotation-marker
      onClick={(e) => {
        e.stopPropagation()
        if (!isExiting) {
          onClick(annotation)
        }
      }}
      onContextMenu={
        onContextMenu
          ? (e) => {
              if (markerClickBehavior === 'delete') {
                e.preventDefault()
                e.stopPropagation()
                if (!isExiting) {
                  onContextMenu(annotation)
                }
              }
            }
          : undefined
      }
      onMouseEnter={() => onHoverEnter(annotation)}
      onMouseLeave={onHoverLeave}
      style={{
        animationDelay,
        backgroundColor: showDeleteHover ? undefined : markerColor,
        left: `${annotation.x}%`,
        top: annotation.y,
      }}
    >
      {showDeleteState ? (
        showDeleteHover ? (
          <IconXmark size={isMulti ? 18 : 16} />
        ) : (
          <IconEdit size={16} />
        )
      ) : (
        <span
          className={
            renumberFrom !== null && globalIndex >= renumberFrom ? styles.renumber : undefined
          }
        >
          {globalIndex + 1}
        </span>
      )}

      {isHovered && !isEditingAny && (
        <div className={`${styles.markerTooltip} ${styles.enter}`} style={tooltipStyle}>
          <span className={styles.markerQuote}>
            {annotation.element}
            {annotation.selectedText &&
              ` "${annotation.selectedText.slice(0, 30)}${annotation.selectedText.length > 30 ? '...' : ''}"`}
          </span>
          <span className={styles.markerNote}>{annotation.comment}</span>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// PendingMarker
// =============================================================================

type PendingMarkerProps = {
  isExiting: boolean
  isMultiSelect?: boolean
  x: number
  y: number
}

export function PendingMarker({ isExiting, isMultiSelect, x, y }: PendingMarkerProps) {
  return (
    <div
      className={`${styles.marker} ${styles.pending} ${isMultiSelect ? styles.multiSelect : ''} ${isExiting ? styles.exit : styles.enter}`}
      style={{
        backgroundColor: isMultiSelect
          ? 'var(--agentation-color-green)'
          : 'var(--agentation-color-accent)',
        left: `${x}%`,
        top: y,
      }}
    >
      <IconPlus size={12} />
    </div>
  )
}

// =============================================================================
// ExitingMarker
// =============================================================================

type ExitingMarkerProps = {
  annotation: Annotation
  fixed?: boolean
}

export function ExitingMarker({ annotation, fixed }: ExitingMarkerProps) {
  const isMulti = annotation.isMultiSelect
  return (
    <div
      className={`${styles.marker} ${fixed ? styles.fixed : ''} ${styles.hovered} ${isMulti ? styles.multiSelect : ''} ${styles.exit}`}
      data-annotation-marker
      style={{
        left: `${annotation.x}%`,
        top: annotation.y,
      }}
    >
      <IconXmark size={isMulti ? 12 : 10} />
    </div>
  )
}
