'use client'

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { originalSetTimeout } from '../../utils/freeze-animations.js'
import { IconTrash } from '../icons/icons.js'
import styles from './styles.module.scss'

// =============================================================================
// Helpers
// =============================================================================

/** Focus an element while temporarily blocking focus-trap libraries (e.g. Radix
 *  FocusScope) from reclaiming focus via focusin/focusout handlers. */
function focusBypassingTraps(el: HTMLElement | null) {
  if (!el) {
    return
  }
  const trap = (e: Event) => e.stopImmediatePropagation()
  document.addEventListener('focusin', trap, true)
  document.addEventListener('focusout', trap, true)
  try {
    el.focus()
  } finally {
    document.removeEventListener('focusin', trap, true)
    document.removeEventListener('focusout', trap, true)
  }
}

// =============================================================================
// Types
// =============================================================================

export interface AnnotationPopupCSSProps {
  /** Custom color for submit button and textarea focus (hex) */
  accentColor?: string
  /** Computed styles for the selected element */
  computedStyles?: Record<string, string>
  /** Element name to display in header */
  element: string
  /** Initial value for textarea (for edit mode) */
  initialValue?: string
  /** External exit state (parent controls exit animation) */
  isExiting?: boolean
  /** Light mode styling */
  lightMode?: boolean
  /** Called when popup is cancelled/dismissed */
  onCancel: () => void
  /** Called when delete button is clicked (only shown if provided) */
  onDelete?: () => void
  /** Called when annotation is submitted with text */
  onSubmit: (text: string) => void
  /** Placeholder text for the textarea */
  placeholder?: string
  /** Optional selected/highlighted text */
  selectedText?: string
  /** Position styles (left, top) */
  style?: React.CSSProperties
  /** Label for submit button (default: "Add") */
  submitLabel?: string
  /** Optional timestamp display (e.g., "@ 1.23s" for animation feedback) */
  timestamp?: string
}

export interface AnnotationPopupCSSHandle {
  /** Shake the popup (e.g., when user clicks outside) */
  shake: () => void
}

// =============================================================================
// Component
// =============================================================================

export const AnnotationPopupCSS = function AnnotationPopupCSS({
  accentColor = '#3c82f7',
  computedStyles,
  element,
  initialValue = '',
  isExiting = false,
  lightMode = false,
  onCancel,
  onDelete,
  onSubmit,
  placeholder = 'What should change?',
  ref,
  selectedText,
  style,
  submitLabel = 'Add',
  timestamp,
}: { ref?: React.RefObject<AnnotationPopupCSSHandle | null> } & AnnotationPopupCSSProps) {
  const [text, setText] = useState(initialValue)
  const [isShaking, setIsShaking] = useState(false)
  const [animState, setAnimState] = useState<'enter' | 'entered' | 'exit' | 'initial'>('initial')
  const [isFocused, setIsFocused] = useState(false)
  const [isStylesExpanded, setIsStylesExpanded] = useState(false) // Computed styles accordion state
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const cancelTimerRef = useRef<null | number>(null)
  const shakeTimerRef = useRef<null | number>(null)

  // Sync with parent exit state
  useEffect(() => {
    if (isExiting && animState !== 'exit') {
      setAnimState('exit')
    }
  }, [isExiting, animState])

  // Animate in on mount and focus textarea
  useEffect(() => {
    // Start enter animation (use originalSetTimeout to bypass freeze patch)
    originalSetTimeout(() => {
      setAnimState('enter')
    }, 0)
    // Transition to entered state after animation completes
    const enterTimer = originalSetTimeout(() => {
      setAnimState('entered')
    }, 200) // Match animation duration
    const focusTimer = originalSetTimeout(() => {
      const textarea = textareaRef.current
      if (textarea) {
        focusBypassingTraps(textarea)
        textarea.selectionStart = textarea.selectionEnd = textarea.value.length
        textarea.scrollTop = textarea.scrollHeight
      }
    }, 50)
    return () => {
      clearTimeout(enterTimer)
      clearTimeout(focusTimer)
      if (cancelTimerRef.current) {
        clearTimeout(cancelTimerRef.current)
      }
      if (shakeTimerRef.current) {
        clearTimeout(shakeTimerRef.current)
      }
    }
  }, [])

  // Shake animation
  const shake = useCallback(() => {
    if (shakeTimerRef.current) {
      clearTimeout(shakeTimerRef.current)
    }
    setIsShaking(true)
    shakeTimerRef.current = originalSetTimeout(() => {
      setIsShaking(false)
      focusBypassingTraps(textareaRef.current)
    }, 250)
  }, [])

  // Expose shake to parent via ref
  useImperativeHandle(
    ref,
    () => ({
      shake,
    }),
    [shake],
  )

  // Handle cancel with exit animation
  const handleCancel = useCallback(() => {
    setAnimState('exit')
    cancelTimerRef.current = originalSetTimeout(() => {
      onCancel()
    }, 150) // Match exit animation duration
  }, [onCancel])

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (!text.trim()) {
      return
    }
    onSubmit(text.trim())
  }, [text, onSubmit])

  // Handle keyboard
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      e.stopPropagation()
      if (e.nativeEvent.isComposing) {
        return
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
      if (e.key === 'Escape') {
        handleCancel()
      }
    },
    [handleSubmit, handleCancel],
  )

  const popupClassName = [
    styles.popup,
    lightMode ? styles.light : '',
    animState === 'enter' ? styles.enter : '',
    animState === 'entered' ? styles.entered : '',
    animState === 'exit' ? styles.exit : '',
    isShaking ? styles.shake : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={popupClassName}
      data-annotation-popup
      // onClick={(e) => e.stopPropagation()}
      ref={popupRef}
      style={style}
    >
      <div className={styles.header}>
        {computedStyles && Object.keys(computedStyles).length > 0 ? (
          <button
            className={styles.headerToggle}
            onClick={() => {
              const wasExpanded = isStylesExpanded
              setIsStylesExpanded(!isStylesExpanded)
              if (wasExpanded) {
                // Refocus textarea when closing
                originalSetTimeout(() => focusBypassingTraps(textareaRef.current), 0)
              }
            }}
            type="button"
          >
            <svg
              className={`${styles.chevron} ${isStylesExpanded ? styles.expanded : ''}`}
              fill="none"
              height="14"
              viewBox="0 0 14 14"
              width="14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.5 10.25L9 7.25L5.75 4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
            <span className={styles.element}>{element}</span>
          </button>
        ) : (
          <span className={styles.element}>{element}</span>
        )}
        {timestamp && <span className={styles.timestamp}>{timestamp}</span>}
      </div>

      {/* Collapsible computed styles section - uses grid-template-rows for smooth animation */}
      {computedStyles && Object.keys(computedStyles).length > 0 && (
        <div className={`${styles.stylesWrapper} ${isStylesExpanded ? styles.expanded : ''}`}>
          <div className={styles.stylesInner}>
            <div className={styles.stylesBlock}>
              {Object.entries(computedStyles).map(([key, value]) => (
                <div className={styles.styleLine} key={key}>
                  <span className={styles.styleProperty}>
                    {key.replace(/([A-Z])/g, '-$1').toLowerCase()}
                  </span>
                  : <span className={styles.styleValue}>{value}</span>;
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedText && (
        <div className={styles.quote}>
          &ldquo;{selectedText.slice(0, 80)}
          {selectedText.length > 80 ? '...' : ''}&rdquo;
        </div>
      )}

      <textarea
        className={styles.textarea}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        ref={textareaRef}
        rows={2}
        style={{ borderColor: isFocused ? accentColor : undefined }}
        value={text}
      />

      <div className={styles.actions}>
        {onDelete && (
          <div className={styles.deleteWrapper}>
            <button className={styles.deleteButton} onClick={onDelete} type="button">
              <IconTrash size={22} />
            </button>
          </div>
        )}
        <button className={styles.cancel} onClick={handleCancel}>
          Cancel
        </button>
        <button
          className={styles.submit}
          disabled={!text.trim()}
          onClick={handleSubmit}
          style={{
            backgroundColor: accentColor,
            opacity: text.trim() ? 1 : 0.4,
          }}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  )
}

export default AnnotationPopupCSS
