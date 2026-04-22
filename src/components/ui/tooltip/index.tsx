import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { originalSetTimeout } from '../../../utils/freeze-animations.js'

export const Tooltip = ({
  children,
  content,
  ...props
}: {
  children: React.ReactNode
  content: string
} & React.HTMLAttributes<HTMLSpanElement>) => {
  const [visible, setVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [position, setPosition] = useState({ right: 0, top: 0 })
  const triggerRef = useRef<HTMLSpanElement>(null)
  const timeoutRef = useRef<null | ReturnType<typeof originalSetTimeout>>(null)
  const exitTimeoutRef = useRef<null | ReturnType<typeof originalSetTimeout>>(null)

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        right: window.innerWidth - rect.left + 8,
        top: rect.top + rect.height / 2,
      })
    }
  }

  const handleMouseEnter = () => {
    setShouldRender(true)
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current)
      exitTimeoutRef.current = null
    }
    updatePosition()
    timeoutRef.current = originalSetTimeout(() => {
      setVisible(true)
    }, 500)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setVisible(false)
    // Keep rendered during exit animation
    exitTimeoutRef.current = originalSetTimeout(() => {
      setShouldRender(false)
    }, 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <span
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={triggerRef}
        {...props}
      >
        {children}
      </span>
      {shouldRender &&
        createPortal(
          <div
            data-feedback-toolbar
            style={{
              background: '#383838',
              borderRadius: '10px',
              boxShadow: '0px 1px 8px rgba(0, 0, 0, 0.28)',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '11px',
              fontWeight: 400,
              lineHeight: '14px',
              opacity: visible ? 1 : 0,
              padding: '6px 10px',
              pointerEvents: 'none' as const,
              position: 'fixed',
              right: position.right,
              textAlign: 'left' as const,
              top: position.top,
              transform: 'translateY(-50%)',
              transition: 'opacity 0.15s ease',
              width: '180px',
              zIndex: 100020,
            }}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  )
}
